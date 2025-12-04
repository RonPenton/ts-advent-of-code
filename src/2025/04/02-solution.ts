// https://adventofcode.com/2025/day/4

import { readLines, add } from "../../utils";
import { Coord, Direction, Directions, Grid } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`);

type Space = '.' | '@' | 'x';
const grid = Grid.fromLines(lines, x => x as Space);

const rollAdjacent = (c: Coord) => (d: Direction) => {
    if (grid.at(c) !== '@') return -1;
    return grid.atDirectionRaw(c, d) === '@' ? 1 : 0;
}

const canRemove = (c: Coord) => {
    const results = Directions.map(rollAdjacent(c)).reduce(add, 0);
    if (results >= 0 && results < 4) return true;
    return false;
}

let removed = 0;
const remove = (c: Coord) => {
    grid.set(c, 'x');
    removed++;
}

while (true) {
    const lastRemoved = removed;
    grid.filterCoord((_, c) => canRemove(c)).forEach(({ coord }) => remove(coord));
    if (removed === lastRemoved) break;
}

console.log(removed);