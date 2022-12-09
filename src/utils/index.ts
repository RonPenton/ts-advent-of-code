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

export const mult = (a: number, b: number) => a * b;
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

export const arrayFrom = (str: string) => Array.from(str);

export type Coord = [r: number, c: number];
export type GridPredicate<T, R = void> = (r: number, c: number, val: T, grid: T[][]) => R;
export function gridForEach<T>(g: T[][], f: GridPredicate<T>) {
    g.forEach((row, r) => row.forEach((val, c) => f(r, c, val, g)));
}
export function gridMap<T, U>(g: T[][], f: GridPredicate<T, U>) {
    return g.map((row, r) => row.map((val, c) => f(r, c, val, g)));
}
export function gridFind<T>(g: T[][], f: GridPredicate<T, boolean>) {
    let coord: Coord | undefined;
    g.find((row, r) => row.find((val, c) => {
        if (f(r, c, val, g)) {
            coord = [r, c];
            return true;
        }
        return false;
    }));

    if (coord) {
        return { val: g[coord[0]][coord[1]], coord };
    }
    return coord;
}

export type ArrayPredicate<T, R = void> = (value: T, index: number, array: T[]) => R;
export function takeWhile<T>(array: T[], f: ArrayPredicate<T, boolean>): T[] {
    const a: T[] = [];
    for (let i = 0; i < array.length; i++) {
        if (!f(array[i], i, array)) return a;
        a.push(array[i]);
    }
    return a;
}

export const addCoord = ([r1, c1]: Coord, [r2, c2]: Coord): Coord => [r1 + r2, c1 + c2];
export const subCoord = ([r1, c1]: Coord, [r2, c2]: Coord): Coord => [r1 - r2, c1 - c2];
const ads = (a: number, b: number) => Math.pow(Math.abs(a - b), 2);
export const distCoord = ([r1, c1]: Coord, [r2, c2]: Coord): number => Math.sqrt(ads(r1, r2) + ads(c1, c2));
export const multCoord = ([r1, c1]: Coord, [r2, c2]: Coord): Coord => [r1 * r2, c1 * c2];
export const multCoordV = ([r1, c1]: Coord, v: number): Coord => [r1 * v, c1 * v];
