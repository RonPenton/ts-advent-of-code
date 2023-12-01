// https://adventofcode.com/2023/day/1

import { readLines } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(x => !!x);

const concat = (a: string, b: string) => a + b;
const add = (a: number, b: number) => a + b;

const getNumber = (line: string) => {
    const digits = line.match(/\d+/g)!;
    const catted = digits.reduce(concat, '');
    const relevant = [catted[0], [...catted].reverse()[0]];
    const parsed = parseInt(relevant.join(''));
    return parsed;
}

const nums = lines.map(getNumber);
const sum = nums.reduce(add, 0);

console.log(sum);
