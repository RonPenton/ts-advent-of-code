// https://adventofcode.com/2023/day/3

import { notEmpty, range, readLines } from "../../utils";
import { Coord, Directions, Grid, moveCoord, printCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const gearMap = new Map<string, number[]>();

const addGear = (key: string, value: number) => {
    const gears = gearMap.get(key) ?? [];
    gearMap.set(key, [...gears, value]);
}

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Tile = Digit | 'gear' | null;
const isDigit = /\d/i;

const grid = Grid.fromLines(lines, s => {
    if (isDigit.test(s)) return s as Digit;
    if (s === '*') return 'gear';
    return null;
});

const readNumber = (grid: Grid<Tile>, r: number, c: number): string => {
    let n = '';
    while (c < grid.width) {
        const tile = grid.at([r, c]);
        if (tile === null || tile === 'gear') return n;
        n += tile;
        c++;
    }
    return n;
}

const tileAdjacentToGears = (grid: Grid<Tile>, r: number, c: number): Coord[] => {
    const gearDirections = Directions.filter(d => grid.atDirection([r, c], d) === 'gear');
    const gearCoordinates = gearDirections.map(d => moveCoord([r, c], d));
    return gearCoordinates;
}

const numberAdjacentToGears = (grid: Grid<Tile>, r: number, c: number, number: string): string[] => {
    const numberCoords = range(number.length).map(i => [r, c + i]);
    const gearCoords = numberCoords.flatMap(([r, c]) => tileAdjacentToGears(grid, r, c));
    const unique = [...new Set(gearCoords.map(printCoord))];
    return unique;
}

for (let r = 0; r < grid.height; r++) {
    for (let c = 0; c < grid.width; c++) {
        const number = readNumber(grid, r, c);
        if (number.length > 0) {
            const gearCoords = numberAdjacentToGears(grid, r, c, number);
            gearCoords.forEach(x => addGear(x, parseInt(number)));
            c += number.length - 1;
        }
    }
}

const validGears = [...gearMap.entries()].filter(([_, value]) => value.length === 2);
const sum = validGears.reduce((acc, [_, [a, b]]) => (a * b) + acc, 0);
console.log(sum);