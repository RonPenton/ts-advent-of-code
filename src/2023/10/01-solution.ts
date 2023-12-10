// https://adventofcode.com/2023/day/10

import { readLines, notEmpty, Coord } from "../../utils";
import { Direction, Grid, OrthogonalDirections, moveCoord, oppositeDirection, printCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const pipes = ['|', '-', 'F', 'L', 'J', '7'] as const;
type Pipe = typeof pipes[number];

const PipeMap: Record<Pipe, [Direction, Direction]> = {
    '|': ['up', 'down'],
    '-': ['left', 'right'],
    'F': ['down', 'right'],
    'L': ['up', 'right'],
    'J': ['up', 'left'],
    '7': ['down', 'left'],
}

type Start = 'S';
type Empty = '.';

type Tile = Pipe | Start | Empty;

const grid = Grid.fromLines(lines, (x) => x as Tile);

const start = grid.find(x => x === 'S')!;

const tracePath = (
    coord: Coord,
    d: Direction
): number | undefined => {

    const seen = new Set<string>();
    let depth = 0;
    while (true) {
        const key = printCoord(coord);
        if (seen.has(key)) return undefined;
        seen.add(key);

        const nextCoord = moveCoord(coord, d);
        const next = grid.atRaw(nextCoord);

        // out of bounds, loop doesn't terminate.
        if (!next) return undefined;

        // found the start.
        if (next === 'S') return depth + 1;

        // empty ground. loop doesn't terminate.
        if (next === '.') return undefined;

        const nextDirections = PipeMap[next];

        // doesn't connect right.
        if (!nextDirections.map(oppositeDirection).some(x => x === d))
            return undefined;

        const opposite = oppositeDirection(d);
        const nextDirection = nextDirections.find(x => x !== opposite)!;
        depth++;
        coord = nextCoord;
        d = nextDirection;
    }
}


for (const d of OrthogonalDirections) {
    const depth = tracePath(start.coord, d);
    if (depth !== undefined) {
        console.log(depth / 2);
        break;
    }
}
