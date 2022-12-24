//https://adventofcode.com/2022/day/24
import { addCoord, debug, distCoord, readLines } from "../../utils";
import { Coord, Direction, eqCoord, Grid, moveCoord, wrapCoord } from "../../utils/grid";
import PriorityQueue from 'ts-priority-queue';

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

type State = [Coord, number];

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

    const heuristic = ([c, d]: State) => d + distCoord(c, end);
    let looking = new PriorityQueue<State>({
        comparator: (a, b) => heuristic(a) - heuristic(b),
        initialValues: [[start, 0]]
    });

    let memos = new Set<string>();
    const memoize = ([r, c]: Coord, t: number) => `${r},${c}::${t}`;

    while (true) {
        const [current, turn] = looking.dequeue();
        const k = memoize(current, turn);
        if (memos.has(k)) {
            continue;
        }

        memos.add(k);
        const h = heuristic([current, turn]);
        debug(`Examining: ${current}, turn: ${turn}, heuristic: ${h}`, 10000);

        const mv = moves(current, turn + 1);
        for (const m of mv) {
            if (m == 'none') {
                looking.queue([current, turn + 1]);
            }
            else {
                const c = moveCoord(current, m);
                if (eqCoord(c, end)) {
                    return turn + 1;
                }
                looking.queue([c, turn + 1]);
            }
        }
    }
}

const ans = bfs(start, end);
console.log(ans);