import { readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Range = [number, number];
type Pair = [Range, Range];
const split = (c: string) => (str: string) => str.split(c) as [string, string];
const splitGroup = split(',');
const splitPair = split('-');
const isIn = ([[a, b], [x, y]]: Pair) => (a >= x && b <= y) || (x >= a && y <= b);

const answer = lines
    .map(x => splitGroup(x)
        .map(y => splitPair(y))
        .map(([a, b]) => [parseInt(a), parseInt(b)] as Range) as Pair
    )
    .map(isIn)
    .reduce<number>((acc, v) => acc + Number(v), 0)

console.log(answer);
