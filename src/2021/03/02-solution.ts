import fs from 'fs';
const inputFileName = `${__dirname}\\01-input.txt`;
const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
const lines = text.split(/\r?\n/i);

type Summation = { o: number, z: number };

const reduceSummation = ({ o, z }: Summation, digit: string) => digit == '1' ? { o: o + 1, z } : { o, z: z + 1 };

const getMostCommonDigit = (index: number, items: string[]) => {
    const { o, z } = items.map(x => x[index]).reduce(reduceSummation, { o: 0, z: 0 });
    return o >= z ? '1' : '0';
}

const digitFilter = (index: number, digit: string) => (item: string) => item[index] == digit;

type Digit = '1' | '0';
const identity = (o: Digit) => o;
const flip = (o: Digit) => o === '1' ? '0' : '1';

const round = (mod: typeof identity) => (items: string[], index: number) => {
    if(items.length == 1)
        return items;
    const common = getMostCommonDigit(index, items);
    return items.filter(digitFilter(index, mod(common)))
}

const o2round = round(identity);
const co2round = round(flip);

const indices = [...Array(lines[0].length).keys()];
const o2b = indices.reduce((acc, index) => o2round(acc, index), lines);
const co2b = indices.reduce((acc, index) => co2round(acc, index), lines);

const o2 = parseInt(o2b.join(''), 2);
const co2 = parseInt(co2b.join(''), 2);

console.log(o2 * co2);