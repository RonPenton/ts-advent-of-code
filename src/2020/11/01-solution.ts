
import { readLines, notEmpty } from "../../utils";
import { Coord, Directions, Grid } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`);

type Space = '.' | '#' | 'L';

const grid = Grid.fromLines(lines, x => x as Space);


const countOccupiedSeats = ([r, c]: Coord): number => {
    return Directions.map(d => grid.atDirectionRaw([r, c], d))
        .filter(notEmpty)
        .filter(x => x == '#')
        .length;
}

while (true) {

    const seatsToFill = grid.filter((v, r, c) => v == 'L' && countOccupiedSeats([r, c]) == 0);
    const seatsToEmpty = grid.filter((v, r, c) => v == '#' && countOccupiedSeats([r, c]) >= 4);

    const changes = seatsToFill.length + seatsToEmpty.length;
    if (changes == 0)
        break;

    seatsToFill.forEach(({ coord: [r, c] }) => grid.set([r, c], '#'));
    seatsToEmpty.forEach(({ coord: [r, c] }) => grid.set([r, c], 'L'));
}

const occupied = grid.filter(x => x == '#').length;

console.log(occupied);
