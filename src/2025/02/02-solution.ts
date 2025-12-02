// https://adventofcode.com/2025/day/2

import { readLines, notEmpty, readFile } from "../../utils";

const text = readFile(`${__dirname}\\input.txt`);

console.log(text);

type Range = [number, number];

function parseRange(s: string): Range {
    const [startStr, endStr] = s.split("-");
    return [parseInt(startStr, 10), parseInt(endStr, 10)];
}

const ranges = text.split(',').filter(notEmpty).map(parseRange);

const maxDigits = Math.max(...ranges.flatMap(x => x).map(n => n.toString().length))
console.log(maxDigits);

function isOdd(n: number): boolean {
    return n % 2 !== 0;
}

function findInvalidNumbers([start, end]: Range): number[] {
    const startDigits = start.toString().length;
    const endDigits = end.toString().length;

    if (isOdd(startDigits)) start = Math.pow(10, startDigits);
    if (isOdd(endDigits)) end = Math.pow(10, endDigits - 1) - 1;

    if (start > end) return [];

    // sanity check to make sure we're in the same range. 
    if (start.toString().length != end.toString().length) {
        throw new Error(`Range ${start}-${end} spans multiple digit lengths after adjustment`);
    }

    const digits = start.toString().length;

    // another sanity check. 
    if (isOdd(digits)) {
        throw new Error(`Cannot have odd number of digits: ${digits}`);
    }

    const halfDigits = digits / 2;
    const s = parseInt(start.toString().slice(0, halfDigits));
    const e = parseInt(end.toString().slice(0, halfDigits));

    const invalids: number[] = [];

    for (let i = s; i <= e; i++) {
        const val = parseInt(i.toString() + i.toString());
        if (val >= start && val <= end) {
            invalids.push(val);
        }
    }

    return invalids;
}


let sum: number = 0;
for (const range of ranges) {
    const invalids = findInvalidNumbers(range);
    sum = invalids.reduce((acc, curr) => acc + curr, sum);
}

console.log(sum);
