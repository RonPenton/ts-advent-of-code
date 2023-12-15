// https://adventofcode.com/2023/day/15

import { readLines, notEmpty, add } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Lens = { code: string, value: number };
type Input = Lens | { code: string; }

const parseCode = (str: string): Input => {
    if (str.includes('=')) {
        const [code, value] = str.split('=');
        return { code, value: Number(value) };
    }
    return { code: str.replace('-', '') };
}


const inputs = lines.flatMap(line => line.split(',')).map(parseCode);

const hashReduce = (acc: number, b: string): number => (17 * (acc + b.charCodeAt(0))) & 0xff;
const hash = (s: string): number => s.split('').reduce(hashReduce, 0);

const map = new Map<number, Lens[]>();

for (const input of inputs) {
    const h = hash(input.code);
    if ('value' in input) {
        const lenses = map.get(h) ?? [];
        const lens = lenses.find(x => x.code === input.code);
        if (lens)
            lens.value = input.value;
        else
            lenses.push(input);
        map.set(h, lenses);
    } else {
        const lenses = map.get(h) ?? [];
        map.set(h, lenses.filter(x => x.code !== input.code));
    }
}

const focusingPower = (map: Map<number, Lens[]>): number => {
    let power = 0;
    for (const [box, lenses] of map.entries()) {
        power += (box+1) * lenses.reduce((acc, { value }, i) => acc + (value * (i + 1)), 0);
    }
    return power;
}


console.log(focusingPower(map));

