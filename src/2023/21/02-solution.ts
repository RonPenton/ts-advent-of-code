// https://adventofcode.com/2023/day/21

import { readLines, notEmpty } from "../../utils";
import { Coord, Grid, OrthogonalDirections, moveCoord, printCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);
const DISTANCE = 26501365;

type Tile = '.' | '#' | 'S';

const grid = Grid.fromLines(lines, c => c as Tile);

const start = grid.find(x => x === 'S')!.coord;
grid.set(start, '.');


const validMoves = (grid: Grid<Tile>, point: Coord): Coord[] => {
    return OrthogonalDirections
        .map(d => moveCoord(point, d))
        .filter(c => grid.in(c) && grid.at(c) !== '#');
}

type State = [Coord, number];

/**
 * Switching from reverse A* to just a BFS flood-fill. The idea is we just fill
 * outwards from the specified starting point and as long as the distance is
 * divisible by 2 and the distance hasn't been reached yet, we add it to the
 * output. Much simpler. 
 * @param grid 
 * @param start 
 * @param dist 
 * @returns 
 */
const solveGrid = (grid: Grid<Tile>, start: Coord, dist: number): number => {
    const memo = new Set<string>();
    const visited = new Set<string>();
    const queue: State[] = [[start, dist]];

    while (queue.length) {
        const [c, d] = queue.shift()!;
        if (d % 2 == 0) memo.add(printCoord(c));
        if (d == 0) continue;
        validMoves(grid, c).forEach(c => {
            const k = printCoord(c);
            if (visited.has(k)) return;
            visited.add(k);
            queue.push([c, d - 1]);
        });
    }

    return memo.size;
}

// verify part 1 answer is still the same.
console.log(solveGrid(grid, start, 64));


// G = edGe
// O = Odd
// E = Even
//
//     G
//    GOG
//   GOEOG
//  GOEOEOG
//   GOEOG
//    GOG
//     G 

// so let's say the dist is 393 for our example, which would give us the diamond
// above, ie 3 squares from the center.

// (393 / 131 - 1) -> 3-1 -> 2
const gridRadius = Math.floor(DISTANCE / grid.width) - 1;    // subtract one for the center.

// aww fk. Grid is an odd width and therefore the diamond pattern is NOT the same for
// every constrained grid. So there are "odd" and "even" grids. :(

// Think of it like a the diamond is rotated 45 degrees. ie:
// G G G G
//  O O O
// G E E G
//  O O O
// G E E G
//  O O O
// G G G G
// radius squared results in 3x3 or 9 for odds, or 2x2 or 4 for evens. 

// 2 / 2 -> 1 * 2 -> 2 + 1 -> 3 ** 2 -> 9, as confirmed above. 9 "odd" grids.
const oddGrids = Math.pow(Math.floor(gridRadius / 2) * 2 + 1, 2);

// saving for readability. width/height are the same. 
const s = grid.width;

// Grid is square, rectilinear distance from center to any edge is just the width of the grid.
// adding 2 just to be safe, number needs to be odd (width of grid is odd).
const oddPoints = solveGrid(grid, start, s + 2);

// 2 + 1 -> 3 / 2 -> 1 * 2 -> 2 ** 2 -> 4, as confirmed above. 4 "even" grids.
const evenGrids = Math.pow(Math.floor((gridRadius + 1) / 2) * 2, 2);
const evenPoints = solveGrid(grid, start, s + 1);
console.log({ gridRadius, oddGrids, oddPoints, evenGrids, evenPoints });

// now for the literal "edge" cases. SIGH. 
// this day is ALL edge cases.

// Edge cases part 1: Top/Bottom/Left/Right squares. 
// distance = grid.height - 1 because there's a straight path from the center of
// every grid straight up/down/left/right. No fancy calcs required.
const top = solveGrid(grid, [s - 1, start[1]], s - 1);
const bottom = solveGrid(grid, [0, start[1]], s - 1);
const left = solveGrid(grid, [start[0], s - 1], s - 1);
const right = solveGrid(grid, [start[0], 0], s - 1);
console.log({ top, bottom, left, right });

// edge cases part 2: Diagonals
// actually appears to be 2 variations of diagonals. 
//  1. odd diagonal, repeated in all 4 directions. 
//  2. even diagonal, repeated in all 4 directions.

const evenDistance = Math.floor(s / 2) - 1;
const evenTopLeft = solveGrid(grid, [s - 1, s - 1], evenDistance);
const evenTopRight = solveGrid(grid, [s - 1, 0], evenDistance);
const evenBottomLeft = solveGrid(grid, [0, s - 1], evenDistance);
const evenBottomRight = solveGrid(grid, [0, 0], evenDistance);
console.log({ evenTopLeft, evenTopRight, evenBottomLeft, evenBottomRight });

const oddDistance = Math.floor((s * 3) / 2) - 1;
const oddTopLeft = solveGrid(grid, [s - 1, s - 1], oddDistance);
const oddTopRight = solveGrid(grid, [s - 1, 0], oddDistance);
const oddBottomLeft = solveGrid(grid, [0, s - 1], oddDistance);
const oddBottomRight = solveGrid(grid, [0, 0], oddDistance);
console.log({ oddTopLeft, oddTopRight, oddBottomLeft, oddBottomRight });

// now we just add everything up.
const total = oddGrids * oddPoints
    + evenGrids * evenPoints
    + top + bottom + left + right
    + ((gridRadius + 1) * (evenTopLeft + evenTopRight + evenBottomLeft + evenBottomRight))
    + (gridRadius * (oddTopLeft + oddTopRight + oddBottomLeft + oddBottomRight));

console.log(total);

// I hated this one.
