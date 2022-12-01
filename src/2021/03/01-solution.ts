import fs from 'fs';
const inputFileName = `${__dirname}\\01-input.txt`;
const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
const lines = text.split(/\r?\n/i);

const buckets = new Map<number, number>();
const add = (index: number) => buckets.set(index, (buckets.get(index) ?? 0) + 1);
const addToBucket = (digit: string, index: number) => digit == '1' ? add(index) : buckets;

lines.forEach(x => Array.from(x).forEach(addToBucket));
const cutoff = lines.length / 2;
const indices = Array.from(buckets.keys()).sort((a, b) => a - b);
function notEmpty<T>(o: T | undefined | null): o is T {
    return o !== null && o !== null;
}
const base = indices.map(x => buckets.get(x)).filter(notEmpty).map(x => x > cutoff ? '1' : '0');
const gamma = base.join('');
const invert = (s: string) => s == '1' ? '0' : '1';
const epsilon = base.map(invert).join('');

const g = parseInt(gamma, 2);
const e = parseInt(epsilon, 2);

console.log(g * e);
