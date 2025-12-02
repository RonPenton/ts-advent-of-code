// https://adventofcode.com/2025/day/1

import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const start = 50;

type Direction = 'L' | 'R';

type Instruction = [Direction, number];

function rotate([direction, amount]: Instruction, current: number): number {
    if(direction == 'L') {
        amount = -amount;
    }

    const val = (current + amount) % 100;
    return val < 0 ? val + 100 : val;
}

function parseLine(s: string): Instruction {
    const direction = s[0] as Direction;
    const amount = parseInt(s.slice(1), 10);
    return [direction, amount];
}

const instructions = lines.filter(notEmpty).map(parseLine);


let zeroes = 0;
let position = start;
for(const instruction of instructions) {
    position = rotate(instruction, position);
    if(position === 0) {
        zeroes++;
    }
}
console.log({zeroes});