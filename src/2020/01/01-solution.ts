// https://adventofcode.com/2020/day/1

import { fparseInt, readLines } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const numbers = lines.map(fparseInt);

for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
        if (numbers[i] + numbers[j] == 2020) {
            const product = numbers[i] * numbers[j];
            console.log(product);
            process.exit();
        }
    }
}
