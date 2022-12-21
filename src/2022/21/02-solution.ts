//https://adventofcode.com/2022/day/21
import { filterIterable, findIterable, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const numreg = /(\w{4}): (\d+)/i;
const opreg = /(\w{4}): (\w{4}) ([+\-\*\/]) (\w{4})/i

const operator = ['-', '+', '*', '/'] as const;
type Operator = typeof operator[number];

type Node = {
    name: string;
    value?: number;
    op?: Operator;
    childNames?: string[];
    children: Node[];
}


const operate = (op: Operator, a: number, b: number) => {
    switch (op) {
        case '*': return a * b;
        case '+': return a + b;
        case '-': return a - b;
        case '/': return a / b;
    }
}
const solve = (op: Operator, a: number, e: number, right: boolean) => {
    if (right) {
        switch (op) {
            case '/': return a / e;
            case '-': return -e + a;
        }
    }
    switch (op) {
        case '*': return e / a;
        case '+': return e - a;
        case '-': return e + a;
        case '/': return e * a;
    }
}

const nodes = new Map<string, Node>();

const parseLine = (s: string) => {
    const numRes = numreg.exec(s);
    if (numRes) {
        const [_, name, val] = numRes;
        nodes.set(name, { name, value: parseInt(val), children: [] });
        return;
    }

    const opRes = opreg.exec(s);
    if (opRes) {
        const [_, name, a, op, b] = opRes;
        nodes.set(name, { name, op: op as Operator, childNames: [a, b], children: [] });
    }
}

lines.forEach(parseLine);

for (const node of filterIterable(nodes.values(), x => !!x.childNames)) {
    for (const name of node.childNames!) {
        node.children.push(nodes.get(name)!);
    }
}

const calc = (node: Node): number => {
    if (node.value)
        return node.value;
    return operate(node.op!, calc(node.children[0]), calc(node.children[1]));
}

const find = (node: Node): boolean => {
    if (node.name == 'humn')
        return true;

    return node.children.some(x => find(x));
}

const solveNode = (node: Node, e = 0): number => {

    if (node.name == 'humn')
        return e;

    const humn = find(node.children[0]) ? 0 : 1;

    if (node.name == 'root') {
        e = calc(node.children[Number(!humn)]);
        return solveNode(node.children[humn], e);
    }

    const val = calc(node.children[Number(!humn)]);
    const a = solve(node.op!, val, e, humn == 1);
    return solveNode(node.children[humn], a);
}

const root = nodes.get('root')!;

const z = calc(root);
console.log(z);

const e = solveNode(root);

console.log(e);
