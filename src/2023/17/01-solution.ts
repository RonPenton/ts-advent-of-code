// https://adventofcode.com/2023/day/17

import PriorityQueue from "ts-priority-queue";
import { readLines, notEmpty, Coord, distCoord, debug } from "../../utils";
import { Grid, OrthogonalDirection, OrthogonalDirections, eqCoord, moveCoord, rotate } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const Moves = OrthogonalDirections;
type Move = typeof Moves[number];
type State = [Coord, number, Move[]];

const grid = Grid.fromLines(lines, x => Number(x));

// A crucible can conceivably pass through a point more than once,
// because of the direction/length constraints on the path, it may need
// to do a loopy-loo through the same point that it's already been through.
// So we don't want to disallow re-visiting points we've already seen.
// However, we also don't want to enter long repetetive loops either,
// so we'll keep track of how a coordinate has been entered. If
// it's already been entered via the same path (last 3 directions),
// then we won't allow it. 
const visitedKey = (c: Coord, m: Move[]) => `${c[0]},${c[1]}::${m}`;
const visited = new Set<string>();


const validMoves = (crucible: Coord, currentPath: Move[]): Move[] => {
    const lastThree = currentPath.slice(-3).reverse();
    let [current] = lastThree;
    current = current ?? 'down'; // seed it with a default for the first move.
    const angles = [-90, 0, 90] as const;
    let moves = angles.map(a => rotate(current, a));
    if (lastThree.filter(x => x == current).length >= 3) {
        moves = moves.filter(x => x != current);
    }
    moves = moves.filter(d => grid.in(moveCoord(crucible, d)));
    return moves as OrthogonalDirection[];
}

const bfs = (start: Coord, end: Coord) => {

    // A* heuristic, closer to the end is preferred so we don't get stuck looping forever.
    const heuristic = ([c, d]: State) => grid.at(c)! + d + distCoord(c, end);

    const looking = new PriorityQueue<State>({
        comparator: (a, b) => heuristic(a) - heuristic(b),
        initialValues: [[start, 0, []]]
    });

    while (true) {
        const [current, dist, path] = looking.dequeue();

        const h = heuristic([current, dist, path]);
        debug(`Examining: ${current}, dist: ${dist}, path: ${path.length}, heuristic: ${h}`, 1000);

        const mv = validMoves(current, path);
        for (const m of mv) {
            const c = moveCoord(current, m);
            const d = dist + grid.at(c)!;

            if (eqCoord(c, end)) {
                return d;
            }

            const p = [...path, m];

            const lastThree = p.slice(-3);
            const vk = visitedKey(c, lastThree);
            if (!visited.has(vk)) {
                looking.queue([c, d, p]);
                visited.add(vk);
            }
        }
    }
}

const start: Coord = [0, 0];
const end: Coord = [grid.height - 1, grid.width - 1];

const ans = bfs(start, end);
console.log(ans);
