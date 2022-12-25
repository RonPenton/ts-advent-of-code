//https://adventofcode.com/2022/day/25
import { add, readLines } from "../../utils";

const lines = readLines(`${__dirname}\\01-input.txt`);

const translate: Record<string, number> = {
    '2': 2,
    '1': 1,
    '0': 0,
    '-': -1,
    '=': -2
};

const snafu: Record<number, string> = {
    [-2]: '=',
    [-1]: '-',
    [0]: '0',
    [1]: '1',
    [2]: '2'
};

const toSnafu = (s: string) => {
    const ss = [...s].reverse();
    let acc = 0;
    for (let i = 0; i < ss.length; i++) {
        acc += translate[ss[i]] * Math.pow(5, i);
    }
    return acc;
}

const fromSnafu = (n: number) => {
    let sn: string[] = [];
    while (n) {
        let r = (n % 5);
        if (r > 2) {
            r = r - 5;
        }
        n -= r;
        n /= 5;
        sn.unshift(snafu[r]);
    }

    return sn.join('');
}

const nums = lines.map(toSnafu);
const sum = nums.reduce(add);
const val = fromSnafu(sum);
console.log(val);
