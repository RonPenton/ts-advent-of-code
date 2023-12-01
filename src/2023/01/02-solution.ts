// https://adventofcode.com/2023/day/1

import { indexOf } from "lodash";
import { keysOf, readLines } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(x => !!x);

const concat = (a: string, b: string) => a + b;
const add = (a: number, b: number) => a + b;

const map = {
    'zero': '0',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
}

const mapWords = (line: string) => {
    const newLine = [];

    const words = keysOf(map);
    const digits = words.map(x => map[x]);

    for (let i = 0; i < line.length; i++) {
        if (digits.includes(line[i])) {
            newLine.push(line[i]);
        }

        const match = words
            .map(word => ({ word, digit: map[word], index: line.indexOf(word, i) }))
            .find(x => x.index === i);

        if (match) {
            newLine.push(match.digit);
        }
    }

    return newLine.join('');
}

const getNumber = (line: string) => {
    const digits = line.match(/\d+/g)!;
    const catted = digits.reduce(concat, '');
    const relevant = [catted[0], [...catted].reverse()[0]];
    const parsed = parseInt(relevant.join(''));
    return parsed;
}

const digitized = lines.map(mapWords);
const nums = digitized.map(getNumber);
const sum = nums.reduce(add, 0);

console.log(sum);
