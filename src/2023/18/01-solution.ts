// https://adventofcode.com/2023/day/18

import { readLines, notEmpty } from "../../utils";
import { Coord, Deltas, Grid, OrthogonalDirection, OrthogonalDirections, addCoord, iterateOrthogonal, moveCoord, scaleCoord } from "../../utils/grid";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type D = 'R' | 'L' | 'U' | 'D';
type Instruction = { direction: OrthogonalDirection, distance: number };

const DMap: Record<D, OrthogonalDirection> = {
    R: 'right',
    L: 'left',
    U: 'up',
    D: 'down',
};

const parseLine = (line: string): Instruction => {
    const [d, n] = line.split(' ');
    return {
        direction: DMap[d as D],
        distance: Number(n),
    };
}

const instructions = lines.map(parseLine);
const grid = Grid.from<'#' | '.'>(1000, 1000, '.');

const start: Coord = [500, 500];

const digTrench = (grid: Grid<'#' | '.'>, start: Coord, instructions: Instruction[]) => {
    let current = start;
    for (const { direction, distance } of instructions) {
        const d = addCoord(current, scaleCoord(Deltas[direction], distance));
        iterateOrthogonal(current, d, c => grid.set(c, '#'));
        current = d;
    }
}

const enclosedMap = new Map<string, 'out' | 'in'>();
const markEnclosed = (grid: Grid<'#' | '.'>, coord: Coord) => {
    const queue = [coord];
    const visited = new Set<string>();

    if (grid.at(coord) === '#') {
        return 'trench';
    }

    while (queue.length > 0) {
        const c = queue.shift()!;
        const key = c.join(',');
        if (enclosedMap.has(key)) {
            const val = enclosedMap.get(key)!;
            for (const v of visited.keys()) {
                enclosedMap.set(v, val);
            }
            return val;
        }
        if(visited.has(key)) {
            continue;
        }

        if (!grid.in(c)) {
            for (const v of visited.keys()) {
                enclosedMap.set(v, 'out');
            }
            return 'out';
        }

        if (grid.at(c) === '#') {
            // hit a trench edge, don't explore further from this tile. 
            continue;
        }

        visited.add(key);
        const adjacents = OrthogonalDirections.map(d => moveCoord(c, d));
        queue.push(...adjacents);
    }

    // exhausted all tiles, so we're enclosed
    for (const v of visited.keys()) {
        enclosedMap.set(v, 'in');
    }
    return 'in';
}

digTrench(grid, start, instructions);

grid.forEach((_, r, c) => markEnclosed(grid, [r, c]));

iter(enclosedMap.entries())
    .filter(([_, v]) => v === 'in')
    .map(([k]) => k.split(',').map(Number) as Coord)
    .forEach(c => grid.set(c, '#'));

const val = grid.filter(c => c === '#').length;
console.log(val);
