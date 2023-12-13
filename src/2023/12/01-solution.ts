// https://adventofcode.com/2023/day/12

import { readLines, notEmpty, HexadecimalDigit, range, defined, add } from "../../utils";
import { Iter, iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);


type Definition = {
    stream: string,
    sequence: number[]
}

const parseLine = (line: string): Definition => {
    const [left, right] = line.split(' ');
    return {
        stream: left,
        sequence: right.split(',').map(Number)
    }
}

/**
 * Skips to the next character that matches the predicate, or len(stream) if no match is found.
 * @param stream 
 * @param start 
 * @param predicate 
 */
const skipTo = (stream: string, start: number, predicate: (c: string) => boolean, e?: number): number => {
    e = e ?? stream.length;
    let i = start;
    for (; i < e; i++) {
        if (predicate(stream[i])) break;
    }
    return i;
}

const solve = (stream: string, [val, ...rest]: number[]): string[] => {

    if (val === undefined) {
        if (stream.indexOf('#') != -1) return []; // we need a value but none exists.
        return [stream.replaceAll('?', '.')];
    }

    // skip to the first non-dot.
    const s = skipTo(stream, 0, c => c !== '.');
    const e = skipTo(stream, s, c => c === '.') - val;

    // [s, e] represents the total range of positions a ### val can possibly start.

    const computeIfSkip = () => {
        const remaining = stream.slice(s, e + val);
        if (remaining.length && remaining.indexOf('#') == -1) {
            // can't fit the current run, but we can try the next.
            const left = stream.slice(0, e + val).replaceAll('?', '.');
            const right = stream.slice(e + val);
            return solve(right, [val, ...rest]).map(r => left + r);
        }
        return [];
    }
    const skips = computeIfSkip();

    // not enough room in the current run for the given val
    if (e < s) {
        return skips;
    }

    // find the first non-question mark in the valid range, if any.
    // This will further constrain the valid starting positions. 
    const h = skipTo(stream, s, c => c !== '?', e);
    const eprime = Math.min(e, h);

    const fits = Iter.range(s, eprime + 1).flatMap(c => {
        for (let i = c; i < val + s; i++) {
            if (stream[i] === '.') return undefined;
        }

        const left = [
            stream.slice(0, s),
            '.'.repeat(c - s),
            '#'.repeat(val)
        ].join('');
        const right = getRight(stream, c, val);
        if (right === undefined) return undefined;

        const solutions = solve(right, rest).filter(defined);
        if (solutions.length == 0)
            return undefined;

        return solutions.map(r => [left, r].join(''));
    })
        .union(skips)
        .filter(defined)
        .array();

    return fits;
}

const getRight = (stream: string, c: number, val: number) => {
    const right = stream.slice(c + val);
    if (right[0] === '#') return undefined;
    if (right[0] === '?') return '.' + right.slice(1);
    return right;
}

const answer = lines
    .map(parseLine)
    .map(({ stream, sequence }) => solve(stream, sequence))
    .map(x => x.length)
    .reduce(add);

console.log(answer);
