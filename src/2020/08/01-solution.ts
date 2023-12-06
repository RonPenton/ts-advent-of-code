
import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Ins = {
    type: 'nop' | 'acc' | 'jmp';
    val: number;
}

const parseLine = (line: string): Ins => {
    const [type, val] = line.split(" ");
    return { type: type as Ins['type'], val: Number(val) };
}

const instructions = lines.map(parseLine);

let acc = 0;
const visited = new Set<number>();
for(let i = 0; i < instructions.length; i++) {
    const ins = instructions[i];
    if(visited.has(i)) break;
    visited.add(i);
    const { type, val } = ins;
    switch(type) {
        case 'nop': break;
        case 'acc': acc += val; break;
        case 'jmp': i += val - 1; break;
    }
}

console.log(acc);
