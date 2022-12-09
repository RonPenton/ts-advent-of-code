//https://adventofcode.com/2022/day/9
import { addCoord, Coord, distCoord, multCoord, range, readLines, subCoord } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const directions = ['R', 'L', 'U', 'D'] as const;
type Direction = typeof directions[number];

type Move = [Direction, number];

const vectors: Record<Direction, Coord> = {
    'R': [0, 1],
    'L': [0, -1],
    'U': [-1, 0],
    'D': [1, 0]
};

const split = (s: string) => s.split(' ');
const parse = ([dir, amt]: string[]): Move => [dir as Direction, parseInt(amt)];
const mult = ([dir, amt]: Move) => range(amt).map(_ => dir);
const moves = lines.map(split).map(parse).map(mult).flat();

const start: Coord = [0, 0];

type State = [head: Coord, tail: Coord];

const record = new Set<string>;
const coord = ([r, c]: Coord) => `${r},${c}`;

const minDistance = distCoord([0, 0], [1, 1]);

const sign = (n: number) => n < 0 ? -1 : 1;
const normalize = ([r, c]: Coord): Coord => multCoord([Number(r != 0), Number(c != 0)], [sign(r), sign(c)]);

const move = ([head, tail]: State, dir: Direction): State => {
    const newHead = addCoord(head, vectors[dir]);
    const dist = distCoord(newHead, tail);
    if (dist > minDistance) {
        const diff = subCoord(newHead, tail);
        const norm = normalize(diff);
        const newTail = addCoord(tail, norm);
        record.add(coord(newTail));
        return [newHead, newTail];
    }

    return [newHead, tail];
}

const initital: State = [start, start];
record.add(coord(start));

moves.reduce((acc, direction) => move(acc, direction), initital)
console.log(record.size);
