// https://adventofcode.com/2023/day/9

import { readLines, notEmpty, add, defined } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`)
    .filter(notEmpty)
    .map(x => x.split(' ').map(Number));

const deriveNext = (numbers: number[]): number => {

    if(numbers.every(x => x == 0))
        return 0;

    const differences = numbers
        .map((x, i) => i == 0 ? undefined : x - numbers[i - 1])
        .filter(defined);

    return numbers[0] - deriveNext(differences);
}

const previouses = lines.map(deriveNext);
const sum = previouses.reduce(add, 0);

console.log(sum);
