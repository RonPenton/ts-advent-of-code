// https://adventofcode.com/2025/day/6

import { readLines, notEmpty, add, mul } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty).reverse();
const [instructionLine, ...dataLines] = lines;
dataLines.reverse();

let accumumlator = 0;
let currentNumber = '';
let numbers = [];
for (let col = instructionLine.length - 1; col >= 0; col--) {
    for (let row = 0; row < dataLines.length; row++) {
        const digit = dataLines[row][col];
        if (digit !== ' ') currentNumber += digit;
    }

    if (currentNumber !== '') {
        numbers.push(Number(currentNumber));
    }
    currentNumber = '';

    const instruction = instructionLine[col];
    if (instruction !== ' ') {
        const func = instruction === '+' ? add : mul;
        const val = numbers.reduce(func);
        accumumlator = add(accumumlator, val);
        numbers = [];
        currentNumber = '';
    }
}

console.log(accumumlator);
