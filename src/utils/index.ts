import fs from 'fs';

export function readLines(inputFileName: string) {
    const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
    return text.split(/\r?\n/i);
}

export function readFile(inputFileName: string) {
    return fs.readFileSync(inputFileName, { encoding: 'utf-8' });
}

export const defined = <T>(t: T | undefined | null): t is T => t !== undefined && t !== null;
export const add = (a: number, b: number) => a + b;
export const addC = (a: number) => (b: number) => a + b;

export const mult = (a: number) => (b: number) => a * b;
export const fparseInt = (a: string) => parseInt(a);

export const range = (a: number, b?: number): number[] => {
    if (!b) {
        b = a;
        a = 0;
    }

    return [...Array(b - a).keys()].map(addC(a));
}

export function apply<T extends unknown[], U extends unknown[], R>(fn: (...args: [...T, ...U]) => R, ...front: T) {
    return (...tailArgs: U) => fn(...front, ...tailArgs);
}
