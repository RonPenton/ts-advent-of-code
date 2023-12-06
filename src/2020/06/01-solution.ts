
import { readLines, notEmpty, add } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

function* parseLines(line: string[]) {
    let set: Set<string> | undefined = undefined;

    for (const line of lines) {
        if (line.length == 0) {
            if (set) yield set;
            set = undefined;
        }
        else {
            if (!set) set = new Set();
            for (const c of line) set.add(c);
        }
    }

    if (set) yield set;
}

const calculateSetScore = (set: Set<string>) => set.size;

const score = [...parseLines(lines)].map(calculateSetScore).reduce(add, 0);

console.log(score);
