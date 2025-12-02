// https://adventofcode.com/2025/day/1

import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const start = 50;

type Direction = 'L' | 'R';

type Instruction = [Direction, number];

function rotate([direction, amount]: Instruction, current: number): [number, number] {
    if (direction == 'L') {
        amount = -amount;
    }

    let val = current + amount;
    let passZero = 0;

    // fencepost. We started at zero and moved left over it, so 
    // do not count that as a "pass"
    if(current == 0 && val < 0) {
        passZero = -1;
    }

    while (val < 0) {
        val += 100;
        passZero++;
    }
    while (val >= 100) {
        val -= 100;
        passZero++;
    }

    // Another fencepost. If we land exactly on zero moving left,
    // we count that as a pass. If it happens going right then it's 
    // already been counted in the while loop above. 
    if(val == 0 && direction == 'L') {
        passZero++;
    }

    return [val, passZero];
}

function parseLine(s: string): Instruction {
    const direction = s[0] as Direction;
    const amount = parseInt(s.slice(1), 10);
    return [direction, amount];
}

const instructions = lines.filter(notEmpty).map(parseLine);


let zeroes = 0;
let position = start;
for (const instruction of instructions) {
    stop++;
    const [newPosition, passedZero] = rotate(instruction, position);
    position = newPosition;
    zeroes += passedZero;
}
console.log({ zeroes });
