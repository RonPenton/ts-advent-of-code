
import { readLines, notEmpty, defined } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);
const [_, b] = lines;

const busses = b.split(',')
    .map((v, i) => v == 'x' ? undefined : [Number(v), i] as const)
    .filter(defined);

const [first, ...rest] = busses;

let t = first[0];
let step = first[0];

// Chinese remainder theorem
for (const [bus, offset] of rest) {
    while ((t + offset) % bus != 0) {
        t += step;
    }
    step *= bus;
}

console.log(t);