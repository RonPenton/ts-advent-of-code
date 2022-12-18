//https://adventofcode.com/2022/day/18
import { fparseInt, range, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

type V3 = [number, number, number];

const parse = (s: string): V3 => s.split(',').map(fparseInt) as V3;
const vectors = lines.map(parse);
const axes = range(3);

const adjacent = (a: V3, b: V3) => {
    const same = axes.filter(i => a[i] == b[i]);
    if (same.length != 2) return false;
    const diff = axes.find(i => !same.some(j => i == j))!;
    return Math.abs(a[diff] - b[diff]) == 1;
}

type VectorMap = V3[][];

const maxes = axes.map(i => Math.max(...vectors.map((v) => v[i])));

const maps: VectorMap[] = axes.map(i => range(maxes[i] + 1).map(_ => []));

for (const v of vectors) {
    axes.forEach(i => maps[i][v[i]].push(v));
}

let sides = 0;
for (const v of vectors) {
    const a = axes.flatMap(i => maps[i][v[i]].filter(u => adjacent(v, u)));
    sides += 6 - (a.length / 2);    // every adjacent cube will be in the list twice due to sharing two coords
}
console.log(sides);