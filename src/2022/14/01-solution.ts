//https://adventofcode.com/2022/day/14
import { Coord, defined, fparseInt, identity, readLines } from "../../utils";
import { Direction, Grid, iterateOrthogonal, moveCoord } from "../../utils/grid";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Line = [Coord, Coord];
type S = '#' | '.' | '+' | 'o';

const split = (s: string) => s.split(' -> ');
const parse = (s: string) => s.split(',').map(fparseInt).reverse() as Coord;
const segmentize = (c: Coord, i: number, ar: Coord[]): Line | null => !!ar[i + 1] ? [c, ar[i + 1]] : null;

const segments: Line[] = lines.map(x => split(x).map(parse).map(segmentize).filter(defined)).flat();

const height = Math.max(...segments.flat().map(([r]) => r));
const start: Coord = [0, 500];
const grid = Grid.from<S>(height + 1, start[1] * 2, '.');
grid.set(start, '+');

const draw = ([p1, p2]: Line) => iterateOrthogonal(p1, p2, (c) => grid.set(c, '#'));
segments.forEach(draw);

const canMoveInto = (s: S | undefined) => s != '#' && s != 'o';
const moves: Direction[] = ['down', 'downleft', 'downright'];
const nextMove = (c: Coord): Direction | null | 'infinite' => {
    const dir = moves.find(d => canMoveInto(grid.at(moveCoord(c, d))))
    if (dir) {
        if (grid.at(moveCoord(c, dir)) === undefined)
            return 'infinite';
        return dir;
    }
    return null;
}
const simulateMove = (c: Coord): number => {
    let result = nextMove(c);
    if (result == 'infinite') {
        return Infinity;
    }
    if (result == null) {
        grid.set(c, 'o');
        return 0;
    }
    return simulateMove(moveCoord(c, result)) + 1;
}

let count = 0;
while (isFinite(simulateMove(start))) {
    count++;
}

grid.slice(0, 470, height + 1, 550).print(identity);
console.log(count);