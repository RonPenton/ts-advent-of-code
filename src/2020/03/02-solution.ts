import { readLines, notEmpty, identity } from "../../utils";
import { Coord, Grid, addCoord } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const grid = Grid.fromLines(lines, identity);

const offsets: Coord[] = [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 1]
];

const computeTrees = (offset: Coord) => {
    const start: Coord = [0, 0];
    let place = start;
    let trees = 0;
    while (place[0] < grid.height) {
        place = addCoord(place, offset);
        if (grid.atWrap(place) === '#') trees++;
    }
    return trees;
}

const trees = offsets.map(computeTrees).reduce((a, b) => a * b, 1);
console.log(trees);

