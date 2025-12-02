// https://adventofcode.com/2025/day/2

import { notEmpty, readFile } from "../../utils";

const text = readFile(`${__dirname}\\input.txt`);

type Range = [number, number];

function parseRange(s: string): Range {
    const [startStr, endStr] = s.split("-");
    return [parseInt(startStr, 10), parseInt(endStr, 10)];
}

const ranges = text.split(',').filter(notEmpty).map(parseRange);

export function getFactors(n: number): number[] {
    if (!Number.isInteger(n) || n <= 0) {
        throw new Error("Input must be a positive integer.");
    }

    const factors = new Set<number>();

    for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
            factors.add(i);
            factors.add(n / i);
        }
    }

    factors.delete(n); // Exclude the number itself

    return [...factors].sort((a, b) => a - b);
}

function mod(n: number, m: number): number {
    let mo = n % m;
    if (mo === 0) mo = m;
    return mo;
}

function findInvalidNumbersOfDigits([start, end]: Range, digits: number): number[] {
    const startDigits = start.toString().length;
    const endDigits = end.toString().length;

    if (startDigits % digits !== 0) {
        start = Math.pow(10, startDigits - ((digits - 1) - (mod(startDigits, digits))));
    }
    if (endDigits % digits !== 0) {
        end = Math.pow(10, endDigits - (mod(endDigits, digits))) - 1;
    }

    if (start > end) return [];

    // another sanity check.
    if (start.toString().length % digits !== 0 || end.toString().length % digits !== 0) {
        throw new Error(`Expected ${digits} digits but got ${start.toString().length}`);
    }

    const repeats = [...new Set([start.toString().length / digits, end.toString().length / digits])];
    const invalids: number[] = [];

    for (const repeat of repeats) {
        if (repeat == 1) continue;

        const expectedDigits = digits * repeat;
        let s1 = start;
        let e1 = end;

        if (s1.toString().length < expectedDigits) {
            s1 = Math.pow(10, expectedDigits - 1);
        }
        if (e1.toString().length > expectedDigits) {
            e1 = Math.pow(10, expectedDigits) - 1;
        }

        const s = parseInt(s1.toString().slice(0, digits));
        const e = parseInt(e1.toString().slice(0, digits));

        for (let i = s; i <= e; i++) {
            const val = parseInt(new String(i).repeat(repeat));
            if (val >= start && val <= end) {
                invalids.push(val);
            }
        }
    }

    return [...invalids];
}

function findInvalidNumbers([start, end]: Range): number[] {
    const startDigits = start.toString().length;
    const endDigits = end.toString().length;

    const factors = new Set(getFactors(startDigits));
    for (const f of getFactors(endDigits)) {
        factors.add(f);
    }

    const invalids: Set<number> = new Set();
    for (const factor of factors) {
        findInvalidNumbersOfDigits([start, end], factor).forEach(n => invalids.add(n));
    }

    console.log(`Range ${start}-${end} has invalids: ${[...invalids].join(", ")}`);

    return [...invalids];
}


let sum: number = 0;
for (const range of ranges) {
    const invalids = findInvalidNumbers(range);
    sum = invalids.reduce((acc, curr) => acc + curr, sum);
}

console.log(sum);
