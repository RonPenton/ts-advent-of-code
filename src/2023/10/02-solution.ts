// https://adventofcode.com/2023/day/10

import { readLines, notEmpty, Coord } from "../../utils";
import { Direction, Grid, OrthogonalDirections, isOrthogonal, moveCoord, oppositeDirection, parseCoord, printCoord } from "../../utils/grid";

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
const dbgrid = Grid.fromLines(lines, (x) => x as Tile);

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
        if (next === 'S') {
            seen.forEach(x => dbgrid.set(parseCoord(x), '#' as any));
            return depth + 1;
        }

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


const pickDirection = (): Direction => {
    for (const d of OrthogonalDirections) {
        const depth = tracePath(start.coord, d);
        if (depth !== undefined) {
            return d;
        }
    }
    throw new Error();
}

const computePolygon = (coord: Coord, d: Direction): Coord[] => {
    const polygon: Coord[] = [];
    let currentStopPoint = coord;
    while (true) {
        const nextCoord = moveCoord(coord, d);

        if (!isOrthogonal(nextCoord, currentStopPoint)) {
            polygon.push(currentStopPoint);
            currentStopPoint = coord;
        }

        const next = grid.atRaw(nextCoord);

        // found the start.
        if (next === 'S') {
            polygon.push(currentStopPoint);
            return polygon;
        }

        if (next === '.' || !next) throw Error();
        const nextDirections = PipeMap[next];
        const opposite = oppositeDirection(d);
        const nextDirection = nextDirections.find(x => x !== opposite)!;
        coord = nextCoord;
        d = nextDirection;
    }
}

const polygon = computePolygon(start.coord, pickDirection());

function isInside(point: Coord, polygon: Coord[]): boolean {
    let wn = 0; // The winding number counter

    // Loop through all edges of the polygon
    for (let i = 0; i < polygon.length - 1; i++) {
        if (polygon[i][0] <= point[0]) {
            if (polygon[i + 1][0] > point[0])      // An upward crossing
                if (isLeft(polygon[i], polygon[i + 1], point) > 0)  // Point is left of edge
                    ++wn;            // Have a valid up intersect
        }
        else {
            if (polygon[i + 1][0] <= point[0])   // A downward crossing
                if (isLeft(polygon[i], polygon[i + 1], point) < 0)  // Point is right of edge
                    --wn;            // Have a valid down intersect
        }
    }

    return wn !== 0;
}


const isLeft = (a: Coord, b: Coord, point: Coord) => {
    return (b[0] - a[0]) * (point[1] - a[1]) - (point[0] - a[0]) * (b[1] - a[1]);
}

const points = dbgrid.filter(x => x !== '#' as any).filter(x => isInside(x.coord, polygon));

for (const p of points) {
    dbgrid.set(p.coord, 'I' as any);
}

dbgrid.print();

console.log(points.length);
