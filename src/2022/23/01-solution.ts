//https://adventofcode.com/2022/day/23
import { fparseInt, range, readFile, readLines, sortNumber } from "../../utils";
import { Coord, Direction, Directions, Grid, moveCoord, rotate } from "../../utils/grid";
import { Iter } from "../../utils/iter";
const lines = readLines(`${__dirname}\\01-input.txt`);

const grid = new Grid<string>(lines.map(l => [...l]));

const Instructions: Direction[] = [
    'up',
    'down',
    'left',
    'right'
];

const proposal = (elf: Coord, turn: number, grid: Grid<string>) => {

    // if all adjacent positions are empty, do nothing. 
    if (Iter.from(Directions).map(d => moveCoord(elf, d)).map(c => grid.atRaw(c)).every(v => v !== '#'))
        return undefined;

    return Iter.range(turn, turn + 4).map(i => Instructions[i % 4]).find(d => {
        return Iter.from([-45, 0, 45] as const)
            .map(angle => rotate(d, angle))
            .map(td => moveCoord(elf, td))
            .map(c => grid.atRaw(c))
            .every(v => v != '#');
    });
}

const parseCoord = (c: string): Coord => c.split(',').map(fparseInt) as Coord;
const printCoord = ([r, c]: Coord) => `${r},${c}`;

for (let turn = 0; turn < 10; turn++) {
    let moves = Iter.from(grid.filter(x => x == '#'))
        .map(({ coord }) => [coord, proposal(coord, turn, grid)] as const)
        .filter(([_, d]) => d !== undefined)
        .map(([coord, d]) => [coord, moveCoord(coord, d!)] as const)
        .groupBy(([_, c]) => printCoord(c))
        .map(([c, b]) => [c, b.array()] as const)
        .filter(([_, b]) => b.length == 1)
        .map(([c, b]) => [b[0][0], b[0][1]] as const)
        .array();

    if (Iter.from(moves).some(([_, [r]]) => r == -1)) {
        grid.growRowsTop(1, '.');
        moves = moves.map(([a, b]) => [moveCoord(a, 'down'), moveCoord(b, 'down')]);
    }
    if (Iter.from(moves).some(([_, [r]]) => r == grid.height)) {
        grid.growRows(1, '.');
    }

    if (Iter.from(moves).some(([_, [__, c]]) => c == -1)) {
        grid.growColsLeft(1, '.');
        moves = moves.map(([a, b]) => [moveCoord(a, 'right'), moveCoord(b, 'right')]);
    }
    if (Iter.from(moves).some(([_, [__, c]]) => c == grid.width)) {
        grid.growCols(1, '.');
    }

    for (const [start, end] of moves) {
        grid.set(start, '.');
        grid.set(end, '#');
    }
}

const elves = grid.filter(x => x == '#').map(x => x.coord);
const rs = elves.map(([r]) => r).sort(sortNumber);
const cs = elves.map(([_, c]) => c).sort(sortNumber);
const top = rs.at(0)!;
const bottom = rs.at(-1)!;
const left = cs.at(0)!;
const right = cs.at(-1)!;

const pruned = grid.slice(top, left, bottom + 1, right + 1);
const empty = pruned.filter(x => x == '.').length;
console.log(empty);
