//https://adventofcode.com/2021/day/25
import { Coord, identity, readLines } from "../../utils";
import { GridPredicate, Grid, Direction, moveCoord } from "../../utils/grid";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Cucumber = 'v' | '>';
type Square = Cucumber | '.';
const Dirs = { 'v': 'down', '>': 'right' } as const;
const isCucumber = (o: any): o is Cucumber => Object.keys(Dirs).includes(o);
type G = Grid<Square>;

const mover = (symbol: Cucumber, dir: Direction): GridPredicate<Square, boolean> => (x, r, c, g) => {
    return x == symbol && g.atWrap(moveCoord([r, c], dir)) == '.';
}

const easters = mover('>', Dirs['>']);
const downers = mover('v', Dirs['v']);

const move = (g: G) => (c: Coord) => {
    const clone = g.slice();
    const at = clone.at(c)!;
    if (isCucumber(at)) {
        const next = g.wrap(moveCoord(c, Dirs[at]));
        clone.set(next, at)
        clone.set(c, '.');
    }
    return clone;
}

const turn = (grid: G) => {
    const e = grid.filter(easters).map(x => x.coord);
    grid = e.reduce((g, m) => move(g)(m), grid);
    const d = grid.filter(downers).map(x => x.coord);
    grid = d.reduce((g, m) => move(g)(m), grid);
    const moves = e.length + d.length;
    console.log(moves);
    return { grid, moves };
}

const grid = new Grid<Square>(lines.map(l => Array.from(l) as Square[]));

const step = (g: G, steps = 0): number => {
    const { grid, moves } = turn(g);
    if (moves == 0) {
        return steps;
    }
    return step(grid, steps + 1);
}

const s = step(grid);
console.log(s);
