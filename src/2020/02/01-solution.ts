// https://adventofcode.com/2020/day/2

import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Policy = {
    letter: string;
    min: number;
    max: number;
};

const parseLine = (line: string): [Policy, string] => {
    const [policy, password] = line.split(": ");
    return [parsePolicy(policy), password];
}

const parsePolicy = (policy: string): Policy => {
    const [range, letter] = policy.split(" ");
    const [min, max] = range.split("-").map(Number);
    return { letter, min, max };
};

const isValid = ([policy, password]: [Policy, string]) => {
    const count = password.split("").filter(l => l === policy.letter).length;
    return count >= policy.min && count <= policy.max;
};

const solution = lines.map(parseLine).filter(isValid).length;

console.log(solution);
