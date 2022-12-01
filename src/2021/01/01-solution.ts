import fs from 'fs';

const inputFileName = `${__dirname}\\01-input.txt`;
const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
const lines = text.split(/\r?\n/i);
const [first, ...rest] = lines.map(x => parseInt(x));
type Acc = { prev: number, inc: number };
const { inc } = rest.reduce<Acc>(({ prev, inc }, val) => {
    return { prev: val, inc: inc + (val > prev ? 1 : 0) }
}, { prev: first, inc: 0 });
console.log(inc);