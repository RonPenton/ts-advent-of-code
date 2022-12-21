//https://adventofcode.com/2022/day/21
import { findIterable, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const numreg = /(\w{4}): (\d+)/i;
const opreg = /(\w{4}): (\w{4}) ([+\-\*\/]) (\w{4})/i

const operator = ['-', '+', '*', '/'] as const;
type Operator = typeof operator[number];

type Op = {
    names: [string, string],
    op: Operator
};
const numbers = new Map<string, number>();
const ops = new Map<string, Op>();

const parseLine = (s: string) => {
    const numRes = numreg.exec(s);
    if (numRes) {
        const [_, name, val] = numRes;
        numbers.set(name, parseInt(val));
        return;
    }

    const opRes = opreg.exec(s);
    if (opRes) {
        const [_, name, a, op, b] = opRes;
        ops.set(name, { names: [a, b], op: op as Operator });
    }
}

const operate = (op: Operator, a: number, b: number) => {
    switch (op) {
        case '*': return a * b;
        case '+': return a + b;
        case '-': return a - b;
        case '/': return a / b;
    }
}

lines.forEach(parseLine);

while (ops.size > 0) {

    const next = findIterable(ops.entries(), ([_, op]) => numbers.has(op.names[0]) && numbers.has(op.names[1]));
    if (next) {
        const [name, op] = next;
        numbers.set(name, operate(op.op, numbers.get(op.names[0])!, numbers.get(op.names[1])!));
        ops.delete(name);
    }
    else {
        throw new Error('nope');
    }
}

console.log(numbers.get('root'));
