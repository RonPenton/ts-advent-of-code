//https://adventofcode.com/2022/day/10
import { range, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Noop = { type: 'noop' }
type Addx = { type: 'addx', val: number }
type Op = Noop | Addx;

const parse = (s: string): Op[] => {
    const c = s.split(' ');
    const noop = { type: 'noop' } as const;
    switch (c[0]) {
        case 'noop': return [noop];
        case 'addx': return [noop, { type: 'addx', val: parseInt(c[1]) }];
    }
    throw new Error();
}
const reducer = ([head, ...tail]: number[], op: Op) => op.type == 'noop' ? [head, head, ...tail] : [head + op.val, head, ...tail];
const on = (v: number, i: number) => Math.abs(i - v) <= 1;
const render = (on: boolean) => on ? '#' : '.';
const group = (array: number[], size: number) => {
    const groups = Math.floor(array.length / size);
    return range(groups).map(g => array.slice(g * size, g * size + size));
}

const signal = lines.flatMap(parse).reduce<number[]>(reducer, [1, 1]).reverse();
signal.shift();
const groups = group(signal, 40).map(g => g.map(on).map(render).join(''));
groups.forEach(x => console.log(x));
