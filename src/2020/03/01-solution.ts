import { readLines, notEmpty, identity } from "../../utils";
import { Coord, Grid, addCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const grid = Grid.fromLines(lines, identity);

const start: Coord = [0, 0];
const offset: Coord = [1, 3];

let place = start;
let trees = 0;
while(place[0] < grid.height) {
    place = addCoord(place, offset);
    if(grid.atWrap(place) === '#') trees++;
}

console.log(trees);
