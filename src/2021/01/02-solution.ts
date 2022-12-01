import fs from 'fs';

const inputFileName = `${__dirname}\\01-input.txt`;
const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
const lines = text.split(/\r?\n/i);
const [a, b, c, ...rest] = lines.map(x => parseInt(x));
type Acc = { window: readonly [number, number, number], inc: number };
const add = (a: number, b: number) => a + b;
const { inc } = rest.reduce<Acc>(({ window, inc }, val) => {
    const [_, b, c] = window;
    const newWindow = [b, c, val] as const;
    return { window: newWindow, inc: inc + (newWindow.reduce(add) > window.reduce(add) ? 1 : 0) }
}, { window: [a, b, c], inc: 0 });
console.log(inc);