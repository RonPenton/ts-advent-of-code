//https://adventofcode.com/2021/day/06
import { add, fparseInt, readFile } from "../../utils";
import { Iter } from "../../utils/iter";
const population = readFile(`${__dirname}\\01-input.txt`).split(',').map(fparseInt);

const buckets: number[] = Array(7).fill(0);
const waiting: number[] = [0, 0];

const iterate = (turn: number) => {
    const fresh = waiting.shift()!;
    turn = turn % 7;
    waiting.push(buckets[turn]);
    buckets[turn] += fresh;
}

population.forEach(x => buckets[x]++);

Iter.range(256).forEach(iterate);
const answer = buckets.reduce(add) + waiting.reduce(add);
console.log(answer);