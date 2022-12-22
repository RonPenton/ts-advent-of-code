import fs from 'fs';

export function readLines(inputFileName: string) {
    const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
    return text.split(/\r?\n/i);
}

export function readFile(inputFileName: string) {
    return fs.readFileSync(inputFileName, { encoding: 'utf-8' });
}

export const defined = <T>(t: T | undefined | null): t is T => t !== undefined && t !== null;
export const notEmpty = <T>(t: T | undefined | null): t is T => !!t;
export const add = (a: number, b: number) => a + b;
export const addC = (a: number) => (b: number) => a + b;

export const mult = (a: number, b: number) => a * b;
export const fparseInt = (a: string) => parseInt(a);

export const range = (a: number, b?: number): number[] => {
    if (!b) {
        b = a;
        a = 0;
    }

    if (a > b) {
        return [...Array(a - b).keys()].map(addC(b)).reverse();
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

export function gridFilter<T>(g: T[][], f: GridPredicate<T, boolean>) {
    const coords: Coord[] = [];
    g.forEach((row, r) => row.forEach((val, c) => {
        if (f(r, c, val, g)) {
            coords.push([r, c]);
        }
    }));

    return coords;
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


export function keysOf<T extends {}>(t: T): (keyof T)[] {
    return Object.keys(t) as any;
}

export const sortNumber = (a: number, b: number) => a - b;
export const sortNumberRev = (a: number, b: number) => b - a;

export function identity<T>(a: T) { return a };

export const union = <T>(a: Set<T>, b: Set<T>) => new Set<T>([...a, ...b]);
export const intersection = <T>(a: Set<T>, b: Set<T>) => new Set<T>([...a].filter(x => b.has(x)));
export const difference = <T>(a: Set<T>, b: Set<T>) => new Set<T>([...a].filter(x => !b.has(x)));

let d = 0;
export const debug = (s: string) => {
    d++;
    if (d % 100000 == 0) {
        console.log(s);
    }
}

export type Pair<T> = [T, T];
export const pairs = <T>(a: T[]): [T, T][] => {
    const p: [T, T][] = [];
    for (let i = 0; i < a.length; i += 2)
        p[i / 2] = [a[i], a[i + 1]];
    return p;
}

export const fromEntries = <K extends PropertyKey, V>(entries: Iterable<readonly [K, V]>): Partial<Record<K, V>> => {
    return Object.fromEntries(entries) as Record<K, V>;
}
export const entries = <K extends PropertyKey, V>(record: Record<K, V> | Partial<Record<K, V>>): [K, V][] => {
    return Object.entries(record) as [K, V][];
}

export const full = <K extends keyof any, V>(keys: readonly K[], record: Partial<Record<K, V>>): record is Record<K, V> => {
    return keys.every(k => Object.hasOwn(record, k));
}

export function findIterable<T, S extends T>(iterable: IterableIterator<T>, predicate: (value: T, index: number) => value is S): S | undefined;
export function findIterable<T>(iterable: IterableIterator<T>, predicate: (value: T, index: number) => unknown): T | undefined;
export function findIterable<T>(iterable: IterableIterator<T>, predicate: (value: T, index: number) => unknown) {
    let next = iterable.next();
    let idx = 0;

    while (!next.done) {
        if (predicate(next.value, idx)) {
            return next.value;
        }

        idx++;
        next = iterable.next();
    }

    return undefined;
}

export function filterIterable<T, S extends T>(iterable: IterableIterator<T>, predicate: (value: T, index: number) => value is S): Generator<S, void, unknown>;
export function filterIterable<T>(iterable: IterableIterator<T>, predicate: (value: T, index: number) => unknown): Generator<T, void, unknown>;
export function* filterIterable<T>(iterable: IterableIterator<T>, predicate: (value: T, index: number) => unknown) {
    let next = iterable.next();
    let idx = 0;

    while (!next.done) {
        if (predicate(next.value, idx)) {
            yield next.value;
        }

        idx++;
        next = iterable.next();
    }
}

export function* mapIterable<T, U>(iterable: IterableIterator<T>, mapper: (value: T, index: number) => U) {
    let next = iterable.next();
    let idx = 0;

    while (!next.done) {
        yield mapper(next.value, idx)
        idx++;
        next = iterable.next();
    }
}
