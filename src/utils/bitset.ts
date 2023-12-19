export type Bit = 0 | 1;

export type Bitset = Bit[];

export const fromBinaryString = (s: string): Bitset => [...s].reverse().map(Number) as Bitset;

export const toBinaryString = (b: Bitset): string => [...b].reverse().join('');

export const toBase10 = (b: Bitset): number => parseInt(toBinaryString(b), 2);

export const and = (a: Bitset, b: Bitset): Bitset => {
    const max = Math.max(a.length, b.length);
    const a2 = [...a, ...Array(max - a.length).fill(0)];
    const b2 = [...b, ...Array(max - b.length).fill(0)];
    return a2.map((v, i) => (v & b2[i]) as Bit);
}

export const or = (a: Bitset, b: Bitset): Bitset => {
    const max = Math.max(a.length, b.length);
    const a2 = [...a, ...Array(max - a.length).fill(0)];
    const b2 = [...b, ...Array(max - b.length).fill(0)];
    return a2.map((v, i) => (v | b2[i]) as Bit);
}

export const not = (a: Bitset): Bitset => a.map(v => (v ^ 1) as Bit);

export const xor = (a: Bitset, b: Bitset): Bitset => {
    const max = Math.max(a.length, b.length);
    const a2 = [...a, ...Array(max - a.length).fill(0)];
    const b2 = [...b, ...Array(max - b.length).fill(0)];
    return a2.map((v, i) => (v ^ b2[i]) as Bit);
}
