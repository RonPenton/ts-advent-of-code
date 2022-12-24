//https://adventofcode.com/2021/day/05
import { fparseInt, readLines, sortNumberRev } from "../../utils";
import { Coord, Grid, isOrthogonal, iterateDiagonal, iterateOrthogonal } from "../../utils/grid";
import { Iter } from "../../utils/iter";
const text = Iter.from(readLines(`${__dirname}\\01-input.txt`));

type Line = [Coord, Coord];
const parseCoord = (s: string): Coord => s.split(',').map(fparseInt).reverse() as Coord;
const parse = (s: string): Line => s.split(' -> ').map(parseCoord) as Line;

const lines = text.map(parse).array();

const height = lines.flat().map(([r]) => r).sort(sortNumberRev)[0];
const width = lines.flat().map(([_, c]) => c).sort(sortNumberRev)[0];

const map = Grid.from(height + 1, width + 1, 0);

const draw = ([from, to]: Line, grid: Grid<number>) => {
    if (isOrthogonal(from, to))
        iterateOrthogonal(from, to, c => grid.set(c, grid.at(c)! + 1));
    else
        iterateDiagonal(from, to, c => grid.set(c, grid.at(c)! + 1));
}

lines.forEach(l => draw(l, map));
map.print();

const answer = map.filter(x => x > 1).length;
console.log(answer);