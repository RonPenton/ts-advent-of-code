//https://adventofcode.com/2022/day/10
import { add, readLines } from "../../utils";
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
const signalBoost = (n: number, i: number) => i * n;
const picks = (_: number, i: number) => ((i - 20) % 40) == 0;
const reducer = ([head, ...tail]: number[], op: Op) => op.type == 'noop' ? [head, head, ...tail] : [head + op.val, head, ...tail];
const val = lines.flatMap(parse).reduce<number[]>(reducer, [1, 1]).reverse().map(signalBoost).filter(picks).reduce(add);

console.log(val);
