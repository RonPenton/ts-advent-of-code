// https://adventofcode.com/2023/day/13

import { readLines, defined, add } from "../../utils";
import { Grid } from "../../utils/grid";
import { iter } from "../../utils/iter";

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

const findDuplicateScores = (rankScores: number[]): number[] => {
    return iter(rankScores)
        .pairwise()
        .map(([a, b], i) => a == b ? i : undefined)
        .filter(defined)
        .array();
}

const isMirror = (rankScores: number[]): number | undefined => {
    const dupes = findDuplicateScores(rankScores);
    return dupes.find(i => checkMirror(rankScores, i));
}

const checkMirror = (rankScores: number[], start: number): boolean => {
    let i = 0;
    while (true) {
        const a = start - i;
        const b = start + i + 1;
        if (a < 0 || b >= rankScores.length)
            break;
        if (rankScores[a] != rankScores[b])
            return false;
        i++;
    }

    return true;
}

const mirrorScore = (grid: LavaGrid) => {
    const [rows, cols] = [
        isMirror(computeRankScores(grid.rows())),
        isMirror(computeRankScores(grid.columns()))
    ];

    return [
        (rows === undefined ? 0 : rows + 1) * 100,
        cols === undefined ? 0 : cols + 1
    ].reduce(add, 0);
}

const grids = [...parseGrids(lines)];

const scores = grids.map(mirrorScore).reduce(add, 0);

console.log(scores);
