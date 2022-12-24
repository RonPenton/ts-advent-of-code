//https://adventofcode.com/2022/day/24
import { addCoord, debug, distCoord, readLines } from "../../utils";
import { Coord, Direction, eqCoord, Grid, moveCoord, wrapCoord } from "../../utils/grid";
import PriorityQueue from 'ts-priority-queue';
import { Iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\01-input.txt`);

const grid = new Grid<string>(lines.map(x => [...x]));

const start = grid.sliceRows(0, 1).find(x => x == '.')!.coord;
const end = addCoord(grid.sliceRows(grid.height - 1).find(x => x == '.')!.coord, [grid.height - 1, 0]);

const blizzards = grid.filter(x => x != '.' && x != '#').map(({ coord, val }) => [val, coord] as const);
type Blizzard = typeof blizzards[number];

const directions: Record<string, Direction> = {
    '>': 'right',
    'v': 'down',
    '<': 'left',
    '^': 'up'
};

const wrap = wrapCoord(1, 1, grid.height - 1, grid.width - 1);
const moveBlizzard = ([v, c]: Blizzard): Blizzard => [v, wrap(moveCoord(c, directions[v]))];
const getCoord = ([_, c]: Blizzard) => c;

const patterns = grid.width * grid.height;
const blizzardLocations: Coord[][] = [blizzards.map(getCoord)];
let b = blizzards;
for (let i = 1; i < patterns; i++) {
    b = b.map(moveBlizzard);
    blizzardLocations.push(b.map(getCoord));
}

const Moves = ['up', 'down', 'left', 'right', 'none'] as const;
type Move = typeof Moves[number];

type State = [Coord, number, Coord[]];

const moves = (player: Coord, turn: number): Move[] => {
    return Moves.filter(m => {
        const check = m == 'none' ? player : moveCoord(player, m);
        const at = grid.atRaw(check);
        if (at === undefined || at === '#') return false;
        const bs = blizzardLocations[turn % blizzardLocations.length];
        if (bs.some(blizzard => eqCoord(blizzard, check)))
            return false;
        return true;
    });
}

const bfs = (start: Coord, end: Coord) => {

    const distStartEnd = distCoord(start, end);
    const heuristic = ([c, d, wp]: State) => d + distCoord(c, wp[0]) + (wp.length - 1) * distStartEnd;
    let looking = new PriorityQueue<State>({
        comparator: (a, b) => heuristic(a) - heuristic(b),
        initialValues: [[start, 0, [end, start, end]]]
    });

    let memos = new Set<string>();
    const memoize = ([r, c]: Coord, t: number, wp: Coord[]) => `${r},${c}::${t}::${wp.length}`;

    const found = [0, 0, 0, 0];

    while (true) {
        const [current, turn, waypoints] = looking.dequeue();
        const k = memoize(current, turn, waypoints);
        if (memos.has(k)) {
            continue;
        }

        memos.add(k);
        const h = heuristic([current, turn, waypoints]);
        debug(`Examining: ${current}, turn: ${turn}, wp: ${waypoints.length}, heuristic: ${h}`, 10000);

        const mv = moves(current, turn + 1);
        for (const m of mv) {
            if (m == 'none') {
                looking.queue([current, turn + 1, waypoints]);
            }
            else {
                const c = moveCoord(current, m);
                const wp = [...waypoints];
                if (eqCoord(c, wp[0])) {
                    wp.shift();

                    found[wp.length]++;
                    if (found[wp.length] == 100) {
                        console.log(`FOUND 100 at ${wp.length}`);
                        console.log(`Looking length prior to cull: ${looking.length}`);
                        const items = new Iter(function* () {
                            while (looking.length > 0)
                                yield looking.dequeue();
                        }())
                            .filter(([_, __, w]) => w.length <= wp.length)
                            .array();
                        items.forEach(x => looking.queue(x));
                        console.log(`Looking length post cull: ${looking.length}`);
                    }
                }
                if (wp.length == 0) {
                    return turn + 1;
                }
                looking.queue([c, turn + 1, wp]);
            }
        }
    }
}

const ans = bfs(start, end);
console.log(ans);