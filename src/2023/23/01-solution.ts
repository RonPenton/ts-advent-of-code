// https://adventofcode.com/2023/day/23

import { readLines, notEmpty } from "../../utils";
import { Coord, Grid } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Tile = '#' | '.' | '>' | '<' | '^' | 'v';

const map = Grid.fromLines(lines, (c => c as Tile));

const [start, end] = map.filter((t, r, c) => (r == 0 || r == map.height - 1) && t == '.')
    .map(({ coord }) => coord);

const dfs = (start: Coord, end: Coord) => {
console.log(start, end);
