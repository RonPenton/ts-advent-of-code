//https://adventofcode.com/2021/day/25
import { Coord, readLines } from "../../utils";
import { GridPredicate, Grid, Direction, moveCoord } from "../../utils/grid";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Square = 'v' | '>' | '.';

const grid = new Grid<Square>(lines.map(l => Array.from(l) as Square[]));

const mover = (symbol: Square, dir: Direction): GridPredicate<Square, boolean> => (x, r, c, g) => {
    return x == symbol && g.atWrap(moveCoord([r, c], dir)) == '.';
}

const Dirs = { 'v': 'down', '>': 'right' } as const;
type Cucumber = keyof typeof Dirs;
const isCucumber = (o: any): o is Cucumber => Object.keys(Dirs).includes(o);

const easters = mover('>', Dirs['>']);
const downers = mover('v', Dirs['v']);

const move = (g: Grid<Square>) => (c: Coord) => {
    const clone = g.slice();
    const at = clone.at(c)!;
    if (isCucumber(at)) {
        const next = g.wrap(moveCoord(c, Dirs[at]));
        clone.set(next, at)
        clone.set(c, '.');
    }
    return clone;
}

const turn = (grid: Grid<Square>) => {
    const e = grid.filter(easters).map(x => x.coord);
    grid = e.reduce((g, m) => move(g)(m), grid);
    const d = grid.filter(downers).map(x => x.coord);
    grid = d.reduce((g, m) => move(g)(m), grid);
    const moves = e.length + d.length;
    console.log(moves);
    return { grid, moves };
}

let m = 0;
let g = grid;
let step = 0;
do {
    const { grid, moves } = turn(g);
    g = grid;
    m = moves;
    step++;
} while (m > 0)

console.log(step);