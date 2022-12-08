//https://adventofcode.com/2022/day/8
import { Coord, fparseInt, gridMap, mult, range, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Trees = number[];
type Forest = Trees[];

const forest = lines.map(x => Array.from(x).map(fparseInt))

const row = (r: number) => (f: Forest) => f[r];
const col = (c: number) => (f: Forest) => range(f[0].length).map(r => f[r][c]);
const rows = range(forest.length);
const cols = range(forest[0].length);

const directions = ['right', 'left', 'up', 'down'] as const;
type Direction = typeof directions[number];

const get: Record<Direction, (coord: Coord, forest: Forest) => number[]> = {
    'left': ([r, c]: Coord) => range(c).reverse().map(ic => row(r)(forest)[ic]),
    'right': ([r, c]: Coord) => range(c + 1, cols.length).map(ic => row(r)(forest)[ic]),
    'up': ([r, c]: Coord) => range(r).reverse().map(ir => col(c)(forest)[ir]),
    'down': ([r, c]: Coord) => range(r + 1, rows.length).map(ir => col(c)(forest)[ir])
}

const scenicScore = (r: number, c: number, v: number, f: Forest) => {
    const normalize = (values: number[], s: number) => s == -1 ? values.length : s + 1;
    const score = (values: number[]) => values.length ? normalize(values, values.findIndex(x => x >= v)) : 0;
    return directions.map(d => get[d]([r, c], f)).map(score).reduce(mult, 1);
}

const scores = gridMap(forest, scenicScore);
const max = Math.max(...scores.map(x => Math.max(...x)));
console.log(max);
