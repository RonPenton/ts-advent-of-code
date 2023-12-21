// https://adventofcode.com/2023/day/21

import PriorityQueue from "ts-priority-queue";
import { readLines, notEmpty, distCoord, debug } from "../../utils";
import { Coord, Grid, OrthogonalDirections, eqCoord, moveCoord, parseCoord, printCoord, rectilinear } from "../../utils/grid";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);
const DISTANCE = 64;

type Tile = '.' | '#' | 'S';

const grid = Grid.fromLines(lines, c => c as Tile);

const start = grid.find(x => x === 'S')!.coord;
grid.set(start, '.');

// reasoning: Because the grid is a square and all directions are orthogonal, 
// there's a sort of "even"/"odd" pattern to coordinates that can reach the 
// goal in exactly 64 steps. 
// So we're going to search through every point on the map and do a few things.
// 1. If the point has been seen already, skip it.
// 2. If the point is more than 64 steps away rectilinearly, reject it outright.
// 3. Perform an A* search to the start. If we reach the start in less than 65 steps,
//      then we iterate through the point list and for every "even" step from the start,
//      that's a "yes", but every "odd" step is a "no". Memoize these results.
const memos = new Map<string, boolean>();
const minDist = new Map<string, number>();

const validMoves = (grid: Grid<Tile>, point: Coord): Coord[] => {
    return OrthogonalDirections
        .map(d => moveCoord(point, d))
        .filter(c => grid.in(c) && grid.at(c) !== '#');
}

type State = [Coord, number, Coord[]];

const bfs = (start: Coord, end: Coord) => {

    if (grid.at(start) === '#')
        return false;

    if (rectilinear(start, end) > DISTANCE)
        return false;

    // A* heuristic, closer to the end is preferred to guide the search path. 
    const heuristic = ([c, d]: State) => 1 + d + distCoord(c, end);

    const looking = new PriorityQueue<State>({
        comparator: (a, b) => heuristic(a) - heuristic(b),
        initialValues: [[start, 0, [start]]]
    });

    const seen = new Set<string>();

    while (looking.length > 0) {
        const [current, dist, path] = looking.dequeue();

        const key = printCoord(current);
        if (seen.has(key))
            continue;
        seen.add(key);

        // too long, discard.
        if (dist > DISTANCE)
            continue;

        if (eqCoord(current, end)) {
            const p = [...path].reverse();
            p.forEach((c, i) => memos.set(printCoord(c), i % 2 == 0));
            p.forEach((c, i) => minDist.set(printCoord(c), Math.min(i, minDist.get(printCoord(c)) ?? Infinity)));
            return p.length % 2 == 0;
        }

        if (memos.has(key) && minDist.has(key)) {
            const min = minDist.get(key)!;
            const dist = min + path.length - 1;
            if(dist <= DISTANCE) {
                const p = [...path].reverse();
                const v = memos.get(key)! === true ? 0 : 1;
                p.forEach((c, i) => memos.set(printCoord(c), i % 2 == v));
                p.forEach((c, i) => minDist.set(printCoord(c), Math.min(i + min, minDist.get(printCoord(c)) ?? Infinity)));
                return (p.length) % 2 == v;
            }
        }

        const h = heuristic([current, dist, path]);
        debug(`Examining: ${current}, dist: ${dist}, path: ${path.length}, heuristic: ${h}`, 1000);

        const cs = validMoves(grid, current);
        for (const c of cs) {
            looking.queue([c, dist + 1, [...path, c]]);
        }
    }
}

grid.forEach((_, r, c) => bfs([r, c], start));

const reachable = iter(memos.values()).filter(x => x === true).count();
console.log(`Reachable: ${reachable}`);

// iter(memos.entries())
//     .filter(([_, v]) => v === true)
//     .forEach(([k, _]) => grid.set(parseCoord(k), 'O' as any));

// grid.print();