//https://adventofcode.com/2022/day/11
import { fparseInt, notEmpty, range, readFile, sortNumberRev } from "../../utils";
const text = readFile(`${__dirname}\\01-input.txt`);

type Monkey = {
    items: number[];
    op: (value: number) => number;
    test: (value: number) => 'true' | 'false';
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
        test: mod(getNumber(lines[2])),
        outcome: {
            'true': getNumber(lines[3]),
            'false': getNumber(lines[4])
        }
    }
}

const inspect = (m: Monkey) => {
    const item = m.items.shift();
    if (!item) return null;
    const worry = Math.floor(m.op(item) / 3);
    const outcome = m.outcome[m.test(worry)];
    return { worry, outcome };
}

const turn = (i: number, monkeys: Monkey[]) => {
    const m = monkeys[i];
    if (!m) return;
    const result = inspect(m);
    if (result) {
        inspections[i]++;
        monkeys[result.outcome].items.push(result.worry);
        turn(i, monkeys);
    }
    else {
        turn(i + 1, monkeys);
    }
}

const monkeys = split.map(parseMonkey);
const inspections: number[] = Array(monkeys.length).fill(0);

range(20).forEach(_ => turn(0, monkeys));
const [a, b] = inspections.sort(sortNumberRev);

console.log(a * b);
