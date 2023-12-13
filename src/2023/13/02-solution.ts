// https://adventofcode.com/2023/day/13

import { readLines, add } from "../../utils";
import { Grid } from "../../utils/grid";
import { Iter, iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`);

type Tile = '.' | '#';
type LavaGrid = Grid<Tile>;

function* parseGrids(lines: string[]) {
    let grid: LavaGrid | undefined;
    for (const line of lines) {
        if (line.trim().length > 0) {
            if (!grid) {
                grid = Grid.fromLines([line], x => x as Tile);
            } else {
                grid.pushRow(line.split('') as Tile[]);
            }
        }
        else {
            if (grid) {
                yield grid;
                grid = undefined;
            }
        }
    }
    if (grid) yield grid;
}

const computeScore = (tiles: Generator<Tile>): number => {
    const binary = iter(tiles).join('').replaceAll('.', '0').replaceAll('#', '1');
    return parseInt(binary, 2);
}

const computeRankScores = (ranks: Generator<Generator<Tile>>): number[] => {
    return iter(ranks).map(computeScore).array();
}

const findSmudgedMirror = (rankScores: number[]): number | undefined => {
    return Iter.range(0, rankScores.length - 1).find(i => checkSmudgedMirror(rankScores, i));
}

const bitDifference = (a: number, b: number) => {
    let count = 0;
    for (let i = 0; i < 32; i++) {
        const mask = 1 << i;
        if ((a & mask) != (b & mask))
            count++;
    }
    return count;
}

const checkSmudgedMirror = (rankScores: number[], start: number): boolean => {
    let bitDifferences = 0;
    let i = 0;
    while (true) {
        const a = start - i;
        const b = start + i + 1;
        if (a < 0 || b >= rankScores.length)
            break;

        bitDifferences += bitDifference(rankScores[a], rankScores[b]);
        if (bitDifferences > 1)
            return false;
        i++;
    }
    if (bitDifferences == 1)
        return true;

    return false;
}

const mirrorScore = (grid: LavaGrid) => {
    const [rows, cols] = [
        findSmudgedMirror(computeRankScores(grid.rows())),
        findSmudgedMirror(computeRankScores(grid.columns()))
    ];

    return [
        (rows === undefined ? 0 : rows + 1) * 100,
        cols === undefined ? 0 : cols + 1
    ].reduce(add, 0);
}

const grids = [...parseGrids(lines)];

const scores = grids.map(mirrorScore).reduce(add, 0);

console.log(scores);
