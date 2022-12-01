import fs from 'fs';
const inputFileName = `${__dirname}\\01-input.txt`;
const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
const lines = text.split(/\r?\n/i);

const Directions = ['forward', 'down', 'up'] as const;
type Direction = typeof Directions[number];
type Instruction = [Direction, number];
type Location = [number, number, number];   // h,v,aim
const directionMap = (direction: Direction, val: number, [h, v, aim]: Location): Location => {
    switch (direction) {
        case 'down': return [h, v, aim + val];
        case 'up': return [h, v, aim - val];
        case 'forward': return [h + val, v + aim * val, aim];
    }
};
const regex = new RegExp(`(${Directions.join('|')}) (\\d+)`, 'i');
const split = (i: string): Instruction => {
    const match = regex.exec(i);
    if (!match) throw new Error(`Invalid format: ${i}`);
    return [match[1] as Direction, parseInt(match[2])];
}
const instructions = lines.map(split);
const start: Location = [0, 0, 0];
const [h, v] = instructions.reduce<Location>((acc, [d, v]) => directionMap(d, v, acc), start);
const distance = h * v;
console.log(distance);