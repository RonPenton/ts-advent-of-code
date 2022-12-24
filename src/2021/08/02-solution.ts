//https://adventofcode.com/2021/day/08
import { add, readLines } from "../../utils";
import { Iter } from "../../utils/iter";
const lines = readLines(`${__dirname}\\01-input.txt`);


const standardDefinitions = [
    'abcefg',
    'cf',
    'acdeg',
    'acdfg',
    'bcdf',
    'abdfg',
    'abdefg',
    'acf',
    'abcdefg',
    'abcdfg'
].map(x => [...x]);

const lengths = Object.fromEntries(Iter.range(standardDefinitions.length)
    .groupBy(i => standardDefinitions[i].length)
    .map(([l, v]) => [l, v.array()] as const)
    .array()
);

const chars = (s: string) => s.split(' ').map(x => [...x]);
const split = (s: string): Line => s.split(/ \| /i).map(chars) as Line;

type Line = [string[][], string[][]];

const definitions = lines.map(split);

const letters = () => Iter.range(7).map(i => String.fromCharCode('a'.charCodeAt(0) + i));


const test = (map: { [k: string]: string }, def: string[][]) => {
    const reversed = Object.fromEntries(Object.entries(map).map(([a, b]) => [b, a]));
    const mapped = def.map(x => x.map(y => reversed[y]));
    return mapped.every(d => standardDefinitions.some(e => Iter.from(e).setEquals(d)));
}

const mapDigit = (map: { [k: string]: string }, digit: string[]) => {
    const reversed = Object.fromEntries(Object.entries(map).map(([a, b]) => [b, a]));
    const mapped = digit.map(y => reversed[y]);
    return standardDefinitions.findIndex(e => Iter.from(e).setEquals(mapped));
}

type PotentialMapping = [k: string, p: string[]];
type SolidMapping = [k: string, p: string];

const path = (map: PotentialMapping[], p: SolidMapping[]): SolidMapping[][] => {
    if (map.length == 0)
        return [p];
    const [head, ...tail] = map;
    const [l, m] = head;
    const r: SolidMapping[][] = [];
    return m.flatMap(x => path(tail, [...p, [l, x]]))
        .filter(x => Iter.from(x).map(([_, m]) => m).groupBy(m => m).every(([_, g]) => g.count() == 1));
}

const solve = (def: string[][]) => {

    const potentials = Object.fromEntries(letters().map(l => [l, letters().array()]));

    const knownDigits: number[] = [];
    const knowns = def.filter(d => lengths[d.length].length == 1).sort((a, b) => a.length - b.length);
    for (const k of knowns) {
        const digit = standardDefinitions.find(d => d.length == k.length)!;
        knownDigits.push(standardDefinitions.findIndex(d => d.length == k.length))
        for (const l of digit) {
            potentials[l] = Iter.from(potentials[l]).intersection(k).array();
        }
    }

    // don't need this, it ties us to the standard digit range. Without it we can 
    // solve for the general case. 
    // const potentialThrees = def.filter(x => x.length == standardDefinitions[3].length);
    // const three = potentialThrees.find(p => {
    //     return potentialThrees.filter(x => x != p)
    //         .map(x => Iter.from(p).except(x).count())
    //         .every(x => x == 1);
    // })!;
    // for (const l of standardDefinitions[3]) {
    //     potentials[l] = Iter.from(potentials[l]).intersection(three).array();
    // }

    for (const a of Iter.range(10)) {
        for (const b of Iter.range(10)) {
            if (!Iter.from(standardDefinitions[b]).isSubsetOf(standardDefinitions[a]) || a == b)
                continue;
            if (!knownDigits.some(x => x == b))
                continue;

            const left = Iter.from(standardDefinitions[a]).except(standardDefinitions[b]).array();
            const diff = Iter.from(standardDefinitions[b]).intersection(standardDefinitions[a]).array();
            for (const l of left) {
                for (const d of diff) {
                    potentials[l] = Iter.from(potentials[l]).except(potentials[d]).array();
                }
            }
        }
    }

    for (const l of letters()) {
        if (potentials[l].length == 1) {
            for (const k of letters().except([l])) {
                potentials[k] = Iter.from(potentials[k]).except(potentials[l]).array()
            }
        }
    }

    const paths = path(Object.entries(potentials), []);
    const tested = paths.map(x => Object.fromEntries(x)).find(x => test(x, def))!;

    return tested;
}

const ans = definitions.map(([m, d]) => {
    const key = solve(m);
    const digits = d.map(x => mapDigit(key, x));
    return parseInt(digits.join(''));
}).reduce(add);
console.log(ans);