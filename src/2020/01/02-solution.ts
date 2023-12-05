// https://adventofcode.com/2020/day/1

import { fparseInt, readLines } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const numbers = lines.map(fparseInt);

for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
        for (let k = 0; k < numbers.length; k++) {
            if (numbers[i] + numbers[j] + numbers[k] == 2020) {
                const product = numbers[i] * numbers[j] * numbers[k];
                console.log(product);
                process.exit();
            }
        }
    }
}
