// https://adventofcode.com/2023/day/3

import { add, notEmpty, range, readLines } from "../../utils";
import { Directions, Grid } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Tile = Digit | 'symbol' | null;
const isDigit = /\d/i;

const grid = Grid.fromLines(lines, s => {
    if (isDigit.test(s)) return s as Digit;
    if (s !== '.') return 'symbol';
    return null;
});

const readNumber = (grid: Grid<Tile>, r: number, c: number): string => {
    let n = '';
    while (c < grid.width) {
        const tile = grid.at([r, c]);
        if (tile === null || tile === 'symbol') return n;
        n += tile;
        c++;
    }
    return n;
}

const isAdjacentToSymbol = (grid: Grid<Tile>, r: number, c: number): boolean => {
    return Directions.some(d => grid.atDirection([r, c], d) === 'symbol');
}

const isNumberAdjacentToSymbol = (grid: Grid<Tile>, r: number, c: number, number: string): boolean => {
    const coords = range(number.length).map(i => [r, c + i]);
    return coords.some(([r, c]) => isAdjacentToSymbol(grid, r, c));
}

const partNumbers = [];

for (let r = 0; r < grid.height; r++) {
    for (let c = 0; c < grid.width; c++) {
        const number = readNumber(grid, r, c);
        if (number.length > 0) {
            if (isNumberAdjacentToSymbol(grid, r, c, number)) {
                partNumbers.push(number);
            }
            c += number.length - 1;
        }
    }
}

const sum = partNumbers.map(x => parseInt(x)).reduce(add, 0);
console.log(sum);
