// https://adventofcode.com/2023/day/4

import { add, intersection, iterateRegex, notEmpty, range, readLines } from "../../utils";

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
    return intersect.size;
}

const winningCards = lines
    .map(parseLine)
    .map(([winning, have]) => computeWinningNumbers(winning, have));

const cardCount = new Array(winningCards.length).fill(1);

for (let i = 0; i < winningCards.length; i++) {
    const wins = winningCards[i];
    if (wins === 0) continue;

    const count = cardCount[i];
    const winningIndicies = range(i + 1, i + 1 + wins);
    for (const winningIndex of winningIndicies) {
        cardCount[winningIndex] += count;
    }
}

const totalCards = cardCount.reduce(add, 0);
console.log(totalCards);
