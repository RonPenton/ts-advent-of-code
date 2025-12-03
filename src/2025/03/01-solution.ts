// https://adventofcode.com/2025/day/3

import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

type Bank = number[];
const parseLine = (line: string): Bank => line.split('').map((n) => Number(n));

const banks: Bank[] = lines.filter(notEmpty).map(parseLine);

const split = (bank: Bank): [number[], number] => {
    const [last, ...rest] = [...bank].reverse();
    return [rest, last];
}

const getMaxJoltage = (bank: Bank): number => {
    const [front, last] = split(bank);
    const max = Math.max(...front);
    const firstIndex = bank.indexOf(max);
    const after = bank.slice(firstIndex + 1);
    const secondMax = Math.max(...after);
    return parseInt(String(max) + String(secondMax));
}

const totalOutput = banks.reduce((sum, bank) => sum + getMaxJoltage(bank), 0);
console.log(totalOutput);