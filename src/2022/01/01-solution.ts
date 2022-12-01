import fs from 'fs';

const inputFileName = `${__dirname}\\01-input.txt`;
const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
const lines = text.split(/\r?\n/i);
const groups = lines.reduce((a, str) => {
    if (str === '') a.push([]);
    else a[a.length - 1].push(parseInt(str));
    return a;
}, [[]] as number[][]);
const add = (a: number, b: number) => a + b;
const sums = groups.map(x => x.reduce(add, 0));
const max = Math.max(...sums);
console.log(max);