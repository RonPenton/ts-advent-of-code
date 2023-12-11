// https://adventofcode.com/2023/day/11

import { readLines, notEmpty, add } from "../../utils";
import { Grid, rectilinear } from "../../utils/grid";
import { Iter, iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Tile = '#' | '.';

const findEmptyColumnns = (grid: Grid<Tile>): number[] => {
    return iter(grid.columns())
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => iter(c).every(v => v == '.'))
        .map(({ i }) => i)
        .array();
}

const findEmptyRows = (grid: Grid<Tile>): number[] => {
    return iter(grid.rows())
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => iter(r).every(v => v == '.'))
        .map(({ i }) => i)
        .array();
}

const expandUniverse = (grid: Grid<Tile>): Grid<Tile> => {
    const emptyColumns = findEmptyColumnns(grid).reverse();
    const emptyRows = findEmptyRows(grid).reverse();

    const newGrid = grid.clone();

    emptyColumns.forEach(c => newGrid.insertColumn(c, '.'));
    emptyRows.forEach(r => newGrid.insertRow(r, '.'));

    return newGrid;
}

const grid = Grid.fromLines(lines, x => x as Tile);
const expanded = expandUniverse(grid);

const stars = expanded.filter(x => x === '#');

const distances = stars.reduce((acc, { coord: [r, c] }) => {
    const others = iter(stars).filter(x => x.coord[0] != r || x.coord[1] != c);
    const distances = others.map(x => rectilinear([r, c], x.coord)).reduce(add, 0);
    return acc + distances;
}, 0);

console.log(distances/2);