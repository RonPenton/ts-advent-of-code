//https://adventofcode.com/2022/day/11
import { fparseInt, notEmpty, range, readFile, sortNumberRev } from "../../utils";
const text = readFile(`${__dirname}\\01-input.txt`);

type Monkey = {
    items: number[];
    op: (value: number) => number;
    test: number;
    outcome: {
        'true': number,
        'false': number
    }
}

const split = text.split(/Monkey \d+:/im).filter(notEmpty);
const mod = (c: number) => (v: number) => v % c == 0 ? 'true' : 'false';
const pow = (c: number) => (v: number) => Math.pow(v, c);
const add = (c: number) => (v: number) => v + c;
const mul = (c: number) => (v: number) => v * c;

const parseOp = (s: string) => {
    const reg = /Operation: new = old ([\+\*]) (.+)/i;
    const match = reg.exec(s);
    if (!match) throw new Error();
    if (match[1] == '*' && match[2] == 'old') return pow(2);
    if (match[1] == '*') return mul(parseInt(match[2]));
    return add(parseInt(match[2]));
}

const parseItems = (s: string) => {
    const reg = /((?:\d+, )*\d+)/i;
    const match = reg.exec(s);
    if (!match) throw new Error();
    return match[1].split(', ').map(fparseInt);
}

const getNumber = (s: string) => parseInt(/(\d+)/i.exec(s)![0]);

const parseMonkey = (s: string): Monkey => {
    const lines = s.split('\r\n').filter(notEmpty);
    return {
        items: parseItems(lines[0]),
        op: parseOp(lines[1]),
        test: getNumber(lines[2]),
        outcome: {
            'true': getNumber(lines[3]),
            'false': getNumber(lines[4])
        }
    }
}

const inspect = (m: Monkey, modulus: number) => {
    const item = m.items.shift();
    if (item === undefined) return null;
    const worry = m.op(item) % modulus;
    const test = worry % m.test == 0 ? 'true' : 'false' as const;
    const outcome = m.outcome[test];
    return { worry, outcome };
}

const turn = (i: number, monkeys: Monkey[], modulus: number) => {
    const m = monkeys[i];
    if (!m) return;
    const result = inspect(m, modulus);
    if (result) {
        inspections[i]++;
        monkeys[result.outcome].items.push(result.worry);
        turn(i, monkeys, modulus);
    }
    else {
        turn(i + 1, monkeys, modulus);
    }
}

const monkeys = split.map(parseMonkey);
const modulus = monkeys.map(x => x.test).reduce((a, b) => a * b, 1);
const inspections = Array(monkeys.length).fill(0);
range(10000).forEach(_ => turn(0, monkeys, modulus));

const [a, b] = inspections.sort(sortNumberRev);
console.log(a * b);
