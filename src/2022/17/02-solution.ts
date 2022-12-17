//https://adventofcode.com/2022/day/17
import md5 from "md5";
import { addCoord, gridFilter, identity, range, readFile } from "../../utils";
import { Coord, Grid, translate } from "../../utils/grid";

type Jet = '>' | '<';
type P = '.' | '#' | '@';

const text: Jet[] = Array.from(readFile(`${__dirname}\\01-input.txt`)) as Jet[];

type Rock = Coord[];

const rocks: Rock[] = [
    [[0, 0], [0, 1], [0, 2], [0, 3]],           // -
    [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],   // +
    [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],   // L
    [[0, 0], [1, 0], [2, 0], [3, 0]],           // I
    [[0, 0], [0, 1], [1, 0], [1, 1]],           // o
];

const moves = {
    '>': translate([0, 1]),
    '<': translate([0, -1]),
    'down': translate([-1, 0])
}

const bounds: Coord = [0, 7];

const minMax = (range: number[]) => [Math.min(...range), Math.max(...range)] as const;
const rockHeightRange = (r: Rock) => minMax(r.map(([r]) => r));
const intersect = (a: Rock, b: Rock) => a.some(([r1, c1]) => b.some(([r2, c2]) => r1 == r2 && c1 == c2));
const outOfBoundsH = (rock: Rock) => rock.some(([_, c]) => c < bounds[0] || c >= bounds[1]);
const outOfBoundsV = (rock: Rock) => rock.some(([r]) => r < 0);
const touching = (board: Grid<P>, rock: Rock) => {
    const rng = rockHeightRange(rock);
    const boardcoords = board.slice(rng[0], undefined, (rng[1] + 1))
        .filter(x => x != '.')
        .map(x => x.coord)
        .map(translate([rng[0], 0]));
    return intersect(rock, boardcoords);
}


const cols = range(7);

const highestRock = (board: Grid<P>) => {

    // might need to memoize this at some point since the height can only grow.
    for (let r = board.height - 1; r >= 0; r--) {
        if (board.rowAt(r)?.some(x => x == '#')) {
            return r;
        }
    }

    return -1;
}

const patterns = new Map<string, [number, number]>();
const memoKey = (rock: number, jet: number, board: Grid<P>) => {
    return `${rock % rocks.length},${jet % text.length},${hash(board)}`;
}

let board = Grid.from<P>(1, bounds[1], '.');
let bottom = 0;

// 100 seems like it would work. ¯\_(ツ)_/¯
const maxHeight = 100;

const hash = (board: Grid<P>) => {
    const str = board.grid.map(row => row.join('')).join('');
    return md5(str);
}

let rock = 0;
let move = 0;
const total = 1000000000000;
while (rock < total) {

    let left = total - rock;

    const key = memoKey(rock, move, board);
    const m = patterns.get(key);
    if (m) {
        const [mrocks, mheight] = m;
        const h = (board.height + bottom) - mheight;
        const l = mrocks - left;
        bottom += (Math.floor(left / l)) * h;
        left = left % l;
        rock = -(left - total);
    }
    else if (rock > 0) {
        patterns.set(key, [left, (board.height + bottom)]);
    }

    const t = highestRock(board);
    let r = rocks[rock % rocks.length].map(translate([t + 4, 2]));
    board.growRows(6, '.');

    while (true) {
        const m = text[move % text.length];
        let moved = r.map(moves[m]);
        move++;
        if (!outOfBoundsH(moved) && !touching(board, moved)) {
            r = moved;
        }

        moved = r.map(moves.down);
        if (outOfBoundsV(moved) || touching(board, moved)) {
            break;
        }

        r = moved;
    }

    r.forEach(x => board.set(x, '#'));

    const tn = highestRock(board);
    if (board.height > tn - 1) {
        board = board.sliceRows(0, tn + 1);
    }
    if (board.height > maxHeight) {
        const d = board.height - maxHeight;
        board = board.sliceRows(d);
        bottom += d;
    }
    rock++;
}

console.log(bottom + highestRock(board) + 1);
