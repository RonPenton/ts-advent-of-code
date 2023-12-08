// https://adventofcode.com/2023/day/8

import { notEmpty, readLines } from "../../utils";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`);

type Node = {
    left: string;
    right: string;
}

const parseNode = (line: string): [string, Node] | null => {
    const reg = /(\w+) = \((\w+), (\w+)\)/;
    const [, node, left, right] = line.match(reg) ?? [];
    if (node)
        return [node, { left, right }];
    return null;
}

const [instructions, _, ...rest] = lines;

const map = new Map<string, Node>(rest.map(parseNode).filter(notEmpty));


const starts = iter(map.keys()).filter(x => x.endsWith('A')).array();

const findDepth = (start: string): number => {
    let current = start;
    let instruction = 0;
    let count = 0;
    while (!current.endsWith('Z')) {
        const ins = instructions[instruction];
        const { left, right } = map.get(current) ?? { left: '', right: '' };
        if (ins === 'L') {
            current = left;
        } else {
            current = right;
        }
        instruction++;
        if (instruction >= instructions.length) {
            instruction = 0;
        }
        count++;
    }
    return count;
}

const counts = starts.map(findDepth);

const lcm = (a: number, b: number): number => {
    const gcd = (a: number, b: number): number => {
        if (b === 0) {
            return a;
        }
        return gcd(b, a % b);
    }
    return (a * b) / gcd(a, b);
};

const result = counts.reduce(lcm, 1);
console.log(result);
