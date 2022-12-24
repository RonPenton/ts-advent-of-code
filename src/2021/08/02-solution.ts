//https://adventofcode.com/2021/day/08
import { add, readLines } from "../../utils";
import { Iter } from "../../utils/iter";
const lines = readLines(`${__dirname}\\00-sample.txt`);


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

    return knowns;
}

const ans = definitions.map(([d]) => solve(d));
console.log(ans);