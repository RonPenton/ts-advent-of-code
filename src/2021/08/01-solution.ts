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

const solve = (def: string[][]) => {

    const knowns = def.filter(d => lengths[d.length].length == 1)
    return knowns.length;
}

const ans = definitions.map(([_, d]) => solve(d)).reduce(add);
console.log(ans);