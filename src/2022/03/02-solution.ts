import { add, defined, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const upper = (s: string) => !(s.charCodeAt(0) & 32);
const code = (s: string) => (s.charCodeAt(0) & 31);
const priority = (s: string) => upper(s) ? code(s) + 26 : code(s);

const group = (l: string[]) => [...Array(l.length / 3).keys()].map(i => [l[i*3], l[i*3+1], l[i*3+2]]);
const arr = (a: string) => Array.from(a);
const shared = ([a, b, c]: string[]) => s([arr(a), arr(b), arr(c)]);
const s = ([a,b,c]: string[][]) => a.find(x => b.find(y => c.find(z => x == y && y == z)));

const answer = group(lines).map(shared).filter(defined).map(priority).reduce(add);
console.log(answer);
