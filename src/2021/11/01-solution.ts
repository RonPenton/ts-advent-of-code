//https://adventofcode.com/2021/day/10
import { add, defined,  readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const split = (s: string) => [...s];

const defs: [string, string, number][] = [['(', ')', 3], ['[', ']', 57], ['{', '}', 1197], ['<', '>', 25137]];
const opens = defs.map(([s]) => s);
const closes = defs.map(([_, s]) => s);

const validate = (s: string[]): string | undefined => {

    const stack: string[] = [];
    for (const h of s) {
        if (opens.includes(h)) {
            stack.push(h);
        }
        else {
            const o = stack.pop();
            if (o !== opens[closes.indexOf(h)])
                return h;
        }
    }

    return undefined;
}

const system = lines.map(split);
const invalid = system.map(validate).filter(defined).map(c => defs.find(([_, s]) => s == c)![2]).reduce(add);
console.log(invalid)