// https://adventofcode.com/2025/day/6

import { readLines, notEmpty, add, mul } from "../../utils";
import { Iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty).reverse();
const [instructionLine, ...dataLines] = lines;

type Instruction = '+' | '*';

const parseLine = (line: string) => line.split(' ').filter(x => x !== '').map(Number);
const parseInstructions = (str: string): Instruction[] => str.split(' ').filter(notEmpty) as Instruction[]

const data = dataLines.map(parseLine);
const instructions = parseInstructions(instructionLine);

const operations = instructions.length;

const accumulator = (instruction: Instruction) => instruction === '+' ? add : mul;

const value = Iter.range(0, operations).map(op => {
    const func = accumulator(instructions[op]);
    const index = (data: number[]) => data[op];
    return data.map(index).reduce(func);
}).reduce(add, 0);

console.log(value);