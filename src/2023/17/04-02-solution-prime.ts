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
// it's already been entered via the same path (last 10 directions),
// then we won't allow it. 
const visitedKey = (c: Coord) => `${c[0]},${c[1]}`;
const visited = new Set<string>();


const validMoves = (crucible: Coord, currentPath: Move[]): Move[] => {
    if(currentPath.length == 0) {
        // pick a direction, any direction.
        return Moves.filter(d => grid.in(moveCoord(crucible, d)));
    }

    const last4 = currentPath.slice(-4).reverse();
    const [current] = last4;

    // must move a minimum of 4 spaces in a direction before changing direction.
    if(!last4.every(x => x == current)) {
        return [current];
    }

    // can move left, straight, or right. 
    const angles = [-90, 0, 90] as const;
    let moves = angles.map(a => rotate(current, a));

    // can move at most 10 times in the same direction.
    const last10 = currentPath.slice(-10);
    if (last10.filter(x => x == current).length >= 10) {
        moves = moves.filter(x => x != current);
    }

    // make sure the move puts us within the grid.
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

            // can only hit the end if at least the last 4 moves are in the same direction.
            const lastThree = path.slice(-3);
            const canHitEnd = lastThree.length == 3 && lastThree.every(x => x == m);
            if (eqCoord(c, end) && canHitEnd) {
                return d;
            }

            const p = [...path, m];

            const vk = visitedKey(c);
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
