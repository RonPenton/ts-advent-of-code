
import { readLines, notEmpty, add } from "../../utils";
import { Bitset, and, fromBinaryString, or, toBase10 } from "../../utils/bitset";

const lines = readLines(`${__dirname}\\input.txt`);

type MaskValue = '0' | '1' | 'X';
type BitMask = {
    or: Bitset;
    mask: MaskValue[];
}

type Instruction = {
    address: number;
    value: number;
}

const parseMask = (line: string): BitMask => {
    const or = line.replace(/X/g, '0');
    return {
        or: fromBinaryString(parseInt(or, 2).toString(2)),
        mask: line.split('').reverse() as MaskValue[]
    };
}

function* parseInput(lines: string[]): Generator<BitMask | Instruction> {
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
let mask: BitMask = { mask: [], or: [] };

for (const instruction of instructions) {
    if ('or' in instruction) {
        mask = instruction;
    } else {
        const { address, value } = instruction;
        let a = fromBinaryString(address.toString(2));
        a = or(a, mask.or);



        memory.set(instruction.address, value);
    }
}

const numbers = [...memory.values()].map(toBase10).reduce(add, 0);

console.log(numbers);
