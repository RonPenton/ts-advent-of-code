// https://adventofcode.com/2023/day/11

import { readLines, notEmpty, add } from "../../utils";
import { Coord, Grid } from "../../utils/grid";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Tile = '#' | '.';

const isEmptyColumn = (grid: Grid<Tile>, c: number): boolean => {
    return iter(grid.column(c)).every(x => x == '.');
}

const isEmptyRow = (grid: Grid<Tile>, r: number): boolean => {
    return iter(grid.row(r)).every(x => x == '.');
}

const rowStates = new Map<number, 'e' | 'f'>();
const columnStates = new Map<number, 'e' | 'f'>();

const expansionDistance = 1000000;

const findDistance = (grid: Grid<Tile>, a: Coord, b: Coord): number => {
    let distance = 0;
    for (let r = a[0]; r < b[0]; r++) {
        let rowState = rowStates.get(r);
        if (!rowState) {
            rowState = isEmptyRow(grid, r) ? 'e' : 'f';
            rowStates.set(r, rowState);
        }
        if (rowState == 'f') distance++;
        else distance += expansionDistance;
    }
    for (let c = a[1]; c < b[1]; c++) {
        let columnState = columnStates.get(c);
        if (!columnState) {
            columnState = isEmptyColumn(grid, c) ? 'e' : 'f';
            columnStates.set(c, columnState);
        }
        if (columnState == 'f') distance++;
        else distance += expansionDistance;
    }
    return distance;
}

const grid = Grid.fromLines(lines, x => x as Tile);

const stars = grid.filter(x => x === '#');

const distances = stars.reduce((acc, { coord: [r, c] }) => {
    const others = iter(stars).filter(x => x.coord[0] != r || x.coord[1] != c);
    const distances = others.map(x => findDistance(grid, [r, c], x.coord)).reduce(add, 0);
    return acc + distances;
}, 0);

console.log(distances);