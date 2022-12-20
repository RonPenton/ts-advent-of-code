//https://adventofcode.com/2022/day/19
import { add, fparseInt, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const vals = lines.map(fparseInt);

const mix = (a: number[], times: number) => {
    // array of tuples; we want to keep the index so we can figure out what order to work on them in. 
    const mixed = a.map((n, i) => [n, i] as const);

    for (let t = 0; t < times; t++) {
        for (let x = 0; x < a.length; x++) {
            const mi = mixed.findIndex(([_, i]) => i == x);
            const [n, i] = mixed[mi];

            mixed.splice(mi, 1); // delete the item
            mixed.splice((mi + n) % mixed.length, 0, [n, i]); // move it and re-add it. Modulo as necessary.
        }
    }

    return mixed.map(([n]) => n);
}

const decrypted = vals.map(n => n * 811589153);

const mixed = mix(decrypted, 10);

const idx = (a: number[], i: number) => a[i % a.length];

const zero = mixed.indexOf(0);
const answer = [1000, 2000, 3000].map(i => idx(mixed, zero + i)).reduce(add);
console.log(answer);