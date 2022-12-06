import { addC, fparseInt, mult, range, readFile, } from "../../utils";
const stream = readFile(`${__dirname}\\01-input.txt`);

const isUnique = (m: string) => new Set(Array.from(m)).size == m.length;
const sub = (i: number) => (m: string) => m.substring(i, i + 14);
const indicies = range(stream.length - 14);
const answer = indicies.find(i => isUnique(sub(i)(stream)))! + 14;

console.log(answer);
