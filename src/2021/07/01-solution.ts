//https://adventofcode.com/2021/day/07
import { add, fparseInt, readFile, sortNumber, sortNumberRev } from "../../utils";
import { Iter } from "../../utils/iter";
const subs = readFile(`${__dirname}\\01-input.txt`).split(',').map(fparseInt);

const fuel = (p: number) => subs.map(s => Math.abs(s - p)).reduce(add);
subs.sort(sortNumberRev);
const position = Iter.range(0, subs[0] + 1).map(fuel).sort(sortNumber).head();
console.log(position);

