
import { readLines, notEmpty, sortNumber } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty).map(Number);

const sorted = lines.sort(sortNumber);
sorted.push(sorted[sorted.length - 1] + 3);

const diffs = sorted.map((n, i) => i === 0 ? n : n - sorted[i - 1]);
const ones = diffs.filter(n => n === 1).length;
const threes = diffs.filter(n => n === 3).length;
console.log(ones * threes);
