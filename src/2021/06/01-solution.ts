//https://adventofcode.com/2021/day/06
import { fparseInt, readFile } from "../../utils";
import { Iter } from "../../utils/iter";
const population = readFile(`${__dirname}\\01-input.txt`).split(',').map(fparseInt);

const iterate = (v: number): number[] => {
    v = v - 1;
    if(v == -1)
        return [6, 8];
    return [v];
}

const end = Iter.range(80).reduce(pop => pop.flatMap(iterate), population);
console.log(end.length);