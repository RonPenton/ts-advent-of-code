// https://adventofcode.com/2023/day/18

import { readLines, notEmpty, addCoord, add } from "../../utils";
import { Coord, Deltas, OrthogonalDirection, moveCoord, scaleCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Instruction = { direction: OrthogonalDirection, distance: number };

const DMap: Record<number, OrthogonalDirection> = {
    0: 'right',
    1: 'down',
    2: 'left',
    3: 'up'
};

const parseLine = (line: string): Instruction => {
    const [_, __, h] = line.split(' ');
    return {
        direction: DMap[parseInt(h[7])],
        distance: parseInt(h.substring(2, 7), 16)
    };
}

const instructions = lines.map(parseLine);

const start: Coord = [0, 0];

type Edge = [Coord, Coord];

const computeEdges = (instructions: Instruction[]): Edge[] => {
    const edges: Edge[] = [];
    let current = start;
    for (const { direction, distance } of instructions) {
        const d = addCoord(current, scaleCoord(Deltas[direction], distance));
        edges.push([current, d]);
        current = d;
    }
    edges.push([current, start]);
    return edges;
}

const shoeLaceArea = (edges: Edge[]): number => {
    let area = 0;
    for (const [[x1, y1], [x2, y2]] of edges) {
        area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area) / 2;
}

const edges = computeEdges(instructions);

// Shoelace only gets us so far. Essentially since we're on a discrete grid, 
// shoelace treats the points as the exact center of every square, but our area
// extends out to the edges of the squares. So we need to compute the perimeter 
// of the path as well. Since it's a closed loop, we can just add up the distances
// rather than finding the inner/outer corners and counting them as 1/4 or 3/4
// respectively. 
// Since half of the perimeter is inside and half is outside, we divide by two.
//      (dist / 2)
// Finally, we have 4 extra outside corners that don't have an opposing  
// inside corner, so 
//      4 * 1/4 = + 1.
const dist = instructions.map(i => i.distance).reduce(add, 0);
const area = shoeLaceArea(edges) + (dist / 2) + 1;

console.log(area);

