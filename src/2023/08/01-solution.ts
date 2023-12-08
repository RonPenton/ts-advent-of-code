// https://adventofcode.com/2023/day/8

import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

type Node = {
    left: string;
    right: string;
}

const parseNode = (line: string): [string, Node] => {
    const reg = /(\w+) = \((\w+), (\w+)\)/;
    const [, node, left, right] = line.match(reg) ?? [];
    return [node, { left, right }];
}

const [instructions, _, ...rest] = lines;

const map = new Map<string, Node>(rest.map(parseNode));

const start = 'AAA'
let current = start;
let instruction = 0;
let count = 0;
while(current !== 'ZZZ') {
    const ins = instructions[instruction];
    const { left, right } = map.get(current) ?? { left: '', right: '' };
    if (ins === 'L') {
        current = left;
    } else {
        current = right;
    }
    instruction++;
    if(instruction >= instructions.length) {
        instruction = 0;
    }
    count++;
}


console.log(count);
