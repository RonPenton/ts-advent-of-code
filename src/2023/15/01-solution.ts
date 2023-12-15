// https://adventofcode.com/2023/day/15

import { readLines, notEmpty, add } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const inputs = lines.flatMap(line => line.split(','));

const hash = (acc: number, b: string): number => (17 * (acc + b.charCodeAt(0))) & 0xff;

const score = inputs
    .map(x => x.split('').reduce(hash, 0))
    .reduce(add, 0);

console.log(score);
