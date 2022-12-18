//https://adventofcode.com/2022/day/18
import { fparseInt, range, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

type V3 = [number, number, number];

const parse = (s: string): V3 => s.split(',').map(fparseInt) as V3;
const vectors = lines.map(parse);
const axes = range(3);

const maxes = axes.map(i => Math.max(...vectors.map((v) => v[i] + 2)));

const grid = range(maxes[0]).map(_ => range(maxes[1]).map(__ => range(maxes[2]).map(___ => false)));
for (const [x, y, z] of vectors) {
    grid[x][y][z] = true;
}

const addV3 = (a: V3, b: V3): V3 => axes.map(i => a[i] + b[i]) as V3;
const initOne = (i: number, v: number): V3 => axes.map(j => i == j ? v : 0) as V3;

const adjacencies = [-1, 1].flatMap(s => axes.map(i => initOne(i, s)));

const outOfRange = (v: V3) => axes.some(i => v[i] < 0) || axes.some(i => v[i] >= maxes[i]);
const inRange = (v: V3) => !outOfRange(v);

const empties: V3[] = [];
for (let x = 0; x < maxes[0]; x++) {
    for (let y = 0; y < maxes[1]; y++) {
        for (let z = 0; z < maxes[2]; z++) {
            if (grid[x][y][z] == false) empties.push([x, y, z]);
        }
    }
}

const outsides = new Set<string>();
const insides = new Set<string>();
const str = ([x, y, z]: V3) => `${x},${y},${z}`;

const isInside = (initial: V3) => {
    const visited = new Set<string>();
    const left = [initial];

    if (outsides.has(str(initial)))
        return false;
    if (insides.has(str(initial)))
        return true;

    while (left.length > 0) {
        const v = left.shift()!;
        if (visited.has(str(v)))
            continue;

        visited.add(str(v));

        const a = adjacencies.map(d => addV3(v, d));
        if (outsides.has(str(v)) || a.some(outOfRange)) {
            visited.forEach(x => outsides.add(x));
            return false;
        }

        const es = a.filter(([x, y, z]) => grid[x][y][z] == false).filter(v => !visited.has(str(v)));
        es.forEach(v => left.push(v));
    }

    visited.forEach(v => insides.add(v));
    return true;
}

let allSides = 0;
for (const v of vectors) {
    const a = adjacencies.map(d => addV3(v, d));
    const a1 = a.filter(inRange).filter(([x, y, z]) => grid[x][y][z] == false);
    const a2 = a.filter(outOfRange);
    allSides += a1.length + a2.length;
}

const voids = empties.filter(v => isInside(v));
let interiorSides = 0;
for (const v of voids) {
    const a = adjacencies.map(d => addV3(v, d)).filter(([x, y, z]) => grid[x][y][z] == true);
    interiorSides += a.length;
}

console.log(allSides - interiorSides);
