// https://adventofcode.com/2025/day/4

import { readLines, notEmpty, add } from "../../utils";
import { Coord, Direction, Directions, Grid, addCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`);

type Space = '.' | '@' | 'x';
const grid = Grid.fromLines(lines, x => x as Space);

const rollAdjacent = (g: Grid<Space>) => (c: Coord) => (d: Direction) => {
    if (g.at(c) !== '@') return 8;
    return g.atDirectionRaw(c, d) === '@' ? 1 : 0;
}

const adjacent = rollAdjacent(grid);

const total = grid.mapCoord((_, coord) => Directions.map(adjacent(coord)).reduce(add, 0)).filter(x => x < 4).length;

console.log(total);