//https://adventofcode.com/2021/day/09
import { add, defined, fparseInt, readLines } from "../../utils";
import { Direction, Grid, moveCoord } from "../../utils/grid";
const lines = readLines(`${__dirname}\\01-sample.txt`);

const split = (s: string) => [...s];
const grid = new Grid(lines.map(s => split(s).map(fparseInt)));

const directions: Direction[] = ['up', 'down', 'left', 'right'];

const isLowPoint = (v: number, r: number, c: number, g: Grid<number>) => {
    return directions.map(d => g.atRaw(moveCoord([r, c], d))).filter(defined).every(av => av > v);
};
const risk = (v: number) => 1 + v;

const lowPoints = grid.filter(isLowPoint).map(({ val }) => val).map(risk).reduce(add);
console.log(lowPoints);
