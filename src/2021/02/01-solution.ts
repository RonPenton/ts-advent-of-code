import fs from 'fs';
const inputFileName = `${__dirname}\\01-input.txt`;
const text = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
const lines = text.split(/\r?\n/i);

const Directions = ['forward', 'down', 'up'] as const;
type Direction = typeof Directions[number];
type Instruction = [Direction, number];
type Location = [number, number];   // h,v
const DirectionMap: Record<Direction, Location> = {
    'forward': [1, 0],
    'down': [0, 1],
    'up': [0, -1]
};
const add = ([h1, v1]: Location, [h2, v2]: Location): Location => [h1 + h2, v1 + v2];
const mul = ([h, v]: Location, val: number): Location => [h * val, v * val];
const regex = new RegExp(`(${Directions.join('|')}) (\\d+)`, 'i');
const split = (i: string): Instruction => {
    const match = regex.exec(i);
    if (!match) throw new Error(`Invalid format: ${i}`);
    return [match[1] as Direction, parseInt(match[2])];
}
const instructions = lines.map(split);
const start: Location = [0, 0];
const [h, v] = instructions.reduce<Location>((acc, [d, v]) => add(acc, mul(DirectionMap[d], v)), start);
const distance = h * v;
console.log(distance);