//https://adventofcode.com/2021/day/09
import { add, defined, fparseInt, mul, readLines, sortNumberRev } from "../../utils";
import { Direction, Grid, moveCoord, Coord } from "../../utils/grid";
import { Iter } from "../../utils/iter";
const lines = readLines(`${__dirname}\\01-input.txt`);

const split = (s: string) => [...s];
const grid = new Grid(lines.map(s => split(s).map(fparseInt)));

const directions: Direction[] = ['up', 'down', 'left', 'right'];

let current = 0;
const marked = new Map<string, number>;
const key = ([r, c]: Coord) => `${r},${c}`;
const parseKey = (key: string): Coord => key.split(',').map(fparseInt) as Coord;

const bfs = (start: Coord) => {
    if (marked.has(key(start)))
        return;
    if (grid.at(start) == 9)
        return;

    const group = current++;
    const queue = [start];

    while (true) {
        const next = queue.shift();
        if (!next)
            return;
        const adjacents = directions.map(d => moveCoord(next, d))
            .filter(x => grid.atRaw(x) !== undefined && grid.atRaw(x) != 9);
        for (const a of adjacents) {
            if (!marked.has(key(a))) {
                marked.set(key(a), group);
                queue.push(a);
            }
        }
    }
}

grid.forEach((_, r, c) => bfs([r, c]));

const groups = new Iter(marked.entries())
    .groupBy(([_, group]) => group)
    .map(([group, entries]) => entries.map(([s]) => parseKey(s)).count())
    .sort(sortNumberRev)
    .take(3)
    .reduce(mul, 1);

console.log(groups);