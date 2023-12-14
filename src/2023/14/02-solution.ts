// https://adventofcode.com/2023/day/14

import { readLines, notEmpty, Coord, add } from "../../utils";
import { Grid, OrthogonalDirection, eqCoord, moveCoord, rotate } from "../../utils/grid";
import { iter } from "../../utils/iter";
import md5 from "md5";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Tile = 'O' | '#' | '.';

const grid = Grid.fromLines(lines, x => x as Tile);

const computeScore = (col: Generator<Tile>): number => {
    const c = iter(col).array().reverse();
    return iter(c).map((x, i) => x === 'O' ? i  + 1 : 0).reduce(add, 0);
}

/**
 * Starting coord for each direction of tilt.
 */
const starts: Record<OrthogonalDirection, Coord> = {
    'up': [0, 0],
    'right': [0, grid.width - 1],
    'down': [grid.height - 1, grid.width - 1],
    'left': [grid.height - 1, 0]
}

/**
 * 100x100... too much for a map key. 
 * Use md5. 
 * @param board 
 * @returns 
 */
const hash = (grid: Grid<Tile>) => {
    const str = grid.grid.map(row => row.join('')).join('');
    return md5(str);
}


// knew it.
const tilt = (grid: Grid<Tile>, d: OrthogonalDirection) => {

    // this line existed until I read "after 1000000000 cycles".
    // const g = grid.clone(); 

    // Although that's too many to even loop through without copying. 
    // Guess we're doing cycle detection again. 

    const start = starts[d];
    let outer = start;
    let outerScanDir = rotate(d, 90);
    let innerScanDir = rotate(d, 180);

    while (grid.in(outer)) {
        let inner = outer;
        let lastEmptySpace = outer;
        while (grid.in(inner)) {
            if (grid.at(inner) === '#') {
                lastEmptySpace = moveCoord(inner, innerScanDir);
            }
            else if (grid.at(inner) === 'O') {
                if (!eqCoord(inner, lastEmptySpace)) {
                    grid.set(lastEmptySpace, 'O');
                    grid.set(inner, '.');
                }
                lastEmptySpace = moveCoord(lastEmptySpace, innerScanDir);
            }
            inner = moveCoord(inner, innerScanDir);
        }

        outer = moveCoord(outer, outerScanDir);
    }
}

const cycle = (grid: Grid<Tile>) => {
    const dirs = ['up', 'left', 'down', 'right'] as const;
    for (const d of dirs) {
        tilt(grid, d);
    }
}

const map = new Map<string, number>();

let i = 0;
let found = false;
for (; i < 1000000000; i++) {
    if (!found) {
        const h = hash(grid);
        if (map.has(h)) {
            console.log(`cycle found at ${i}, val: ${map.get(h)}`);
            const cycleLength = i - map.get(h)!;
            const left = 1000000000 - i;
            const cycles = Math.floor(left / cycleLength);
            i += cycles * cycleLength;
            found = true;
        }
        else {
            map.set(h, i);
        }
    }

    cycle(grid);
}

const score = iter(grid.columns()).map(computeScore).reduce(add, 0);
console.log(score);