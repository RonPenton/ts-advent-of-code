// https://adventofcode.com/2023/day/23

import { readLines, notEmpty } from "../../utils";
import { Coord, Grid, OrthogonalDirection, OrthogonalDirections, eqCoord, moveCoord, oppositeDirection, printCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Slope = '>' | '<' | '^' | 'v';
type Tile = '#' | '.' | Slope;

const map = Grid.fromLines(lines, (c => c as Tile));

const [start, end] = map.filter((t, r, c) => (r == 0 || r == map.height - 1) && t == '.')
    .map(({ coord }) => coord);


const slopes: Record<Slope, OrthogonalDirection> = {
    '>': 'right',
    '<': 'left',
    '^': 'up',
    'v': 'down',
}

const validMoves = (map: Grid<Tile>, coord: Coord) => {
    return OrthogonalDirections
        .map(dir => [dir, moveCoord(coord, dir)] as const)
        .filter(([dir, c]) => {
            const at = map.at(c);
            if (at === undefined || at === '#') return false;
            const opp = oppositeDirection(dir);

            // can't go up a slope because you have to backtrack to a previous tile.
            if (at !== '.' && slopes[at] == opp) return false;
            return true;
        })
        .map(([_, c]) => c);
}

const dfs = (
    start: Coord,
    end: Coord,
    length: number = 0,
    seen: Set<string> = new Set()
): number => {
    const k = printCoord(start);
    if (seen.has(k)) return 0;
    seen.add(k);

    const moves = validMoves(map, start);
    if (eqCoord(start, end) || moves.length == 0) {
        seen.delete(k);
        return length;
    }

    const lengths = moves.map(c => dfs(c, end, length + 1, seen));
    seen.delete(k);
    return Math.max(...lengths);
}

const max = dfs(start, end);
console.log(max);

