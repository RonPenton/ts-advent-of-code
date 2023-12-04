// https://adventofcode.com/2023/day/4

import { add, intersection, iterateRegex, notEmpty, readLines } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const splitLine = (line: string) => line.split(':')[1];
const parseSegments = (line: string) => line.split('|').map(x => x.trim());
const parseNumbers = (segment: string) => [...iterateRegex(/\d+/g, segment)].map(x => parseInt(x[0]));

const parseLine = (line: string) => {
    const [winning, have] = parseSegments(splitLine(line)).map(parseNumbers);
    return [new Set(winning), new Set(have)];
}

const computeWinningNumbers = (winning: Set<number>, have: Set<number>) => {
    const intersect = intersection(winning, have);
    if(intersect.size === 0) return 0;
    return Math.pow(2, intersect.size - 1);
}

const points = lines.map(parseLine).map(([winning, have]) => computeWinningNumbers(winning, have)).reduce(add, 0);

console.log(points);
