//https://adventofcode.com/2021/day/10
import { add, defined, readLines, sortNumber } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const split = (s: string) => [...s];

const defs: [string, string, number][] = [['(', ')', 1], ['[', ']', 2], ['{', '}', 3], ['<', '>', 4]];
const opens = defs.map(([s]) => s);
const closes = defs.map(([_, s]) => s);
const scores = defs.map(([_, __, s]) => s);

const validate = (s: string[]): string[] => {

    const stack: string[] = [];
    for (const h of s) {
        if (opens.includes(h)) {
            stack.push(h);
        }
        else {
            const o = stack.pop();
            if (o !== opens[closes.indexOf(h)])
                return [];
        }
    }

    const ret: string[] = [];
    while (stack.length > 0) {
        const t = stack.pop()!;
        const i = opens.indexOf(t);
        ret.push(closes[i]);
    }

    return ret;
}

const system = lines.map(split);
const autocomplete = system.map(validate)
    .filter(x => x.length > 0)
    .map(chars => chars.map(c => scores[closes.indexOf(c)]).reduce((acc, c) => (acc * 5) + c, 0))
    .sort(sortNumber);
console.log(autocomplete[Math.floor(autocomplete.length / 2)]);