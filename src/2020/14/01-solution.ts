
import { readLines, notEmpty, add } from "../../utils";
import { Bitset, and, fromBinaryString, or, toBase10 } from "../../utils/bitset";

const lines = readLines(`${__dirname}\\input.txt`);

type Mask = {
    and: Bitset;
    or: Bitset;
}

type Instruction = {
    address: number;
    value: number;
}

const parseMask = (line: string): Mask => {
    const and = line.replace(/X/g, '1');
    const or = line.replace(/X/g, '0');
    return {
        and: fromBinaryString(parseInt(and, 2).toString(2)),
        or: fromBinaryString(parseInt(or, 2).toString(2))
    };
}

function* parseInput(lines: string[]): Generator<Mask | Instruction> {
    for (const line of lines) {
        if (line.startsWith('mask')) {
            yield parseMask(line.split(' = ')[1]);
        } else if (line.startsWith('mem')) {
            const [_, address, value] = line.match(/mem\[(\d+)\] = (\d+)/) ?? [];
            yield { address: Number(address), value: Number(value) };
        }
    }
}

const instructions = [...parseInput(lines)];

const memory = new Map<number, Bitset>();
let mask: Mask = { and: [], or: [] };

for (const instruction of instructions) {
    if ('and' in instruction) {
        mask = instruction;
    } else {
        const { address, value } = instruction;
        let v = fromBinaryString(value.toString(2));
        v = and(v, mask.and);
        v = or(v, mask.or);
        memory.set(instruction.address, v);
    }
}

const numbers = [...memory.values()].map(toBase10).reduce(add, 0);

console.log(numbers);
