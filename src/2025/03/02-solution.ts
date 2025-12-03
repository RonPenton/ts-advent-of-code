// https://adventofcode.com/2025/day/3

import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

type Bank = number[];
const parseLine = (line: string): Bank => line.split('').map((n) => Number(n));

const banks: Bank[] = lines.filter(notEmpty).map(parseLine);

const getFront = (bank: Bank, cutoff: number): Bank => bank.slice(0, bank.length - cutoff);

const getMaxJoltage = (bank: Bank, digits: number, value: number): number => {
    const front = getFront(bank, digits);
    const max = Math.max(...front);

    value = value * 10 + max;

    if(digits === 0)        return value;

    const index = bank.indexOf(max);
    const rest = bank.slice(index + 1);
    return getMaxJoltage(rest, digits - 1, value);
}

const totalOutput = banks.reduce((sum, bank) => sum + getMaxJoltage(bank, 11, 0), 0);
console.log(totalOutput);