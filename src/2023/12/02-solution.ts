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

const unfold = ({ stream, sequence }: Definition): Definition => {
    return {
        stream: iter([stream]).cycle(5).array().join('?'),
        sequence: iter(sequence).cycle(5).array()
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

const key = (def: Definition) => `${def.stream}--${def.sequence.join(',')}`;
const memos = new Map<string, number>();

const solve = (def: Definition): number => {

    const k = key(def);
    if (memos.has(k))
        return memos.get(k)!;

    const solveInner = () => {

        const { stream, sequence: [val, ...rest] } = def;
        if (val === undefined) {
            if (stream.indexOf('#') != -1) return 0; // we need a value but none exists.
            return 1;
        }

        // skip to the first non-dot.
        const s = skipTo(stream, 0, c => c !== '.');
        const e = skipTo(stream, s, c => c === '.') - val;

        // [s, e] represents the total range of positions a ### val can possibly start.

        const computeIfSkip = () => {
            const remaining = stream.slice(s, e + val);
            if (remaining.length && remaining.indexOf('#') == -1) {
                // can't fit the current run, but we can try the next.
                const right = stream.slice(e + val);
                return solve({ stream: right, sequence: [val, ...rest] });
            }
            return 0;
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

        return Iter.range(s, eprime + 1).map(c => {
            for (let i = c; i < val + s; i++) {
                if (stream[i] === '.') return 0;
            }

            const right = getRight(stream, c, val);
            if (right === undefined)
                return 0;

            return solve({ stream: right, sequence: rest });
        }).reduce(add, 0) + skips;
    }

    const val = solveInner();
    memos.set(k, val);
    return val;
}

const getRight = (stream: string, c: number, val: number) => {
    const right = stream.slice(c + val);
    if (right[0] === '#') return undefined;
    if (right[0] === '?') return '.' + right.slice(1);
    return right;
}

const answer = lines
    .map(parseLine)
    .map(unfold)
    .map(solve)
    .reduce(add);

console.log(answer);
