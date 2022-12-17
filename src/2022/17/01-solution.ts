//https://adventofcode.com/2022/day/17
import { readFile } from "../../utils";
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
    const boardcoords = board.slice(rng[0], undefined, rng[1] + 1)
        .filter(x => x != '.')
        .map(x => x.coord)
        .map(translate([rng[0], 0]));
    return intersect(rock, boardcoords);
}
const highestRock = (board: Grid<P>) => {

    // might need to memoize this at some point since the height can only grow.
    for (let r = 0; r < board.height; r++) {
        if (board.rowAt(r)?.every(x => x == '.')) {
            return r - 1;
        }
    }

    return board.height - 1;
}

const board = Grid.from<P>(40000, bounds[1], '.');

let rock = 0;
let move = 0;
while (rock < 10000) {

    const h = highestRock(board);
    let r = rocks[rock % rocks.length].map(translate([h + 4, 2]));

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
    rock++;
}

console.log(highestRock(board) + 1);
