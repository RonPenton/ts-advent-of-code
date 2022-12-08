//https://adventofcode.com/2022/day/3
import { add, defined, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const upper = (s: string) => !(s.charCodeAt(0) & 32);
const code = (s: string) => (s.charCodeAt(0) & 31);
const priority = (s: string) => upper(s) ? code(s) + 26 : code(s);

type Compartments = [string, string];
const bifurcate = (s: string): Compartments => [s.substring(0, s.length / 2), s.substring(s.length / 2)];
const shared = ([a, b]: Compartments) => Array.from(a).find(x => Array.from(b).find(y => y == x));

const answer = lines.map(bifurcate).map(shared).filter(defined).map(priority).reduce(add);
console.log(answer);
