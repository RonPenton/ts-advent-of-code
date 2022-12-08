import { add, fparseInt, gridForEach, range, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Trees = number[];
type Forest = Trees[];
const directions = ['normal', 'opposite'] as const;
type Direction = typeof directions[number];

const forest = lines.map(x => Array.from(x).map(fparseInt))

const row = (r: number) => (f: Forest) => f[r];
const col = (c: number) => (f: Forest) => range(f[0].length).map(r => f[r][c]);
const coord = (r: number, c: number) => `${r},${c}`;

const reducer = (d: Direction) => d == 'normal' ? 'reduce' : 'reduceRight';

const visibles = new Set<string>();

const comp = (r: number, c: number, max: number, height: number) => {
    if (height > max) {
        visibles.add(coord(r, c));
        return height;
    }
    return max;
}

const rows = range(forest.length);
const cols = range(forest[0].length);

directions.forEach(d => {
    rows.forEach(r => row(r)(forest)[reducer(d)]((max, height, c) => comp(r, c, max, height), 0));
    cols.forEach(c => col(c)(forest)[reducer(d)]((max, height, r) => comp(r, c, max, height), 0));
});
rows.forEach(r => {
    visibles.add(coord(r, 0));
    visibles.add(coord(r, cols.at(-1)!));
});
cols.forEach(c => {
    visibles.add(coord(0, c));
    visibles.add(coord(rows.at(-1)!, c));
});

console.log(visibles.size);
