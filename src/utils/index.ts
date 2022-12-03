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

export const mult = (a: number) => (b: number) => a * b;
