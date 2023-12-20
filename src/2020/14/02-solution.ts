
import { readLines, notEmpty, add, defined } from "../../utils";
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

const computeAddresses = (address: Bitset, mask: MaskValue[]): Bitset[] => {
    const indicies = mask.map((v, i) => v === 'X' ? i : undefined).filter(defined);
    return computeIndex(address, indicies);
}

const computeIndex = (address: Bitset, [index, ...rest]: number[]): Bitset[] => {
    if (index === undefined) return [address];
    const a = address.slice();
    a[index] = 0;
    const b = address.slice();
    b[index] = 1;
    return [...computeIndex(a, rest), ...computeIndex(b, rest)];
}

const fill = (value: Bitset): Bitset => {
    const pad = new Array(36 - value.length).fill(0);
    return [...value, ...pad];
}

const instructions = [...parseInput(lines)];

const memory = new Map<number, number>();
let mask: BitMask = { mask: [], or: [] };

for (const instruction of instructions) {
    if ('or' in instruction) {
        mask = instruction;
    } else {
        const { address, value } = instruction;
        let a = fromBinaryString(address.toString(2));
        a = fill(a);
        a = or(a, mask.or);

        const addresses = computeAddresses(a, mask.mask);
        for(const address of addresses) {
            memory.set(toBase10(address), value);
        }
    }
}

const numbers = [...memory.values()].reduce(add, 0);

console.log(numbers);
