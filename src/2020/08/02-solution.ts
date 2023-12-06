
import { cloneDeep } from "lodash";
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

const terminates = (instructions: Ins[]) => {
    let acc = 0;
    const visited = new Set<number>();
    for(let i = 0; i < instructions.length; i++) {
        const ins = instructions[i];
        if(visited.has(i)) return false;
        visited.add(i);
        const { type, val } = ins;
        switch(type) {
            case 'nop': break;
            case 'acc': acc += val; break;
            case 'jmp': i += val - 1; break;
        }
    }

    return acc;
}

for(let i = 0; i < instructions.length; i++) {
    const ins = instructions[i];
    if(ins.type === 'acc') continue;
    const copy = cloneDeep(instructions);
    copy[i] = { ...ins, type: ins.type === 'nop' ? 'jmp' : 'nop' };
    const acc = terminates(copy);
    if(acc !== false) {
        console.log(acc);
        break;
    }
}
