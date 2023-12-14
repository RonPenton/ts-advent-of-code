// https://adventofcode.com/2023/day/14

import { readLines, notEmpty, add } from "../../utils";
import { Grid } from "../../utils/grid";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Tile = 'O' | '#' | '.';

const grid = Grid.fromLines(lines, x => x as Tile);

// probably gonna regret this. I bet in part 2 they make us tilt in many ways, thus requiring
// a simulation rather than a calculation.
const computeColumnScore = (col: Generator<Tile>): number => {
    const c = iter(col).array();
    let i = 0;
    let empty = 0;
    let score = 0;
    for(; i < c.length; i++) {
        if(c[i] === 'O') {
            score += c.length - empty;
            empty ++;
        }
        else if(c[i] === '#') {
            empty = i + 1;
        }
    }

    return score;
}

const score = iter(grid.columns()).map(computeColumnScore).reduce(add, 0);

console.log(score);
