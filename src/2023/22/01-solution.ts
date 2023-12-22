// https://adventofcode.com/2023/day/22

import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Coord3 = [x: number, y: number, z: number];
type Brick = [Coord3, Coord3];

const parseLine = (line: string): Brick => {
    return line.split('~').map(a => a.split(',').map(Number) as Coord3) as Brick;
}

const bricks = lines.map(parseLine);

const brickIntersects = (a: Brick) => (b: Brick) => {
    const [a1, a2] = a;
    const [b1, b2] = b;
    return (
        (a1[0] <= b2[0] && a2[0] >= b1[0]) &&
        (a1[1] <= b2[1] && a2[1] >= b1[1]) &&
        (a1[2] <= b2[2] && a2[2] >= b1[2])
    );
}

const fall = (brick: Brick): Brick => {
    const [[x1, y1, z1], [x2, y2, z2]] = brick;
    return [[x1, y1, z1 - 1], [x2, y2, z2 - 1]];
}

const canFall = (brick: Brick, bricks: Brick[]): boolean => {
    const [[, , z1], [, , z2]] = brick;
    if (z1 == 1 || z2 == 1) return false;
    const falling = fall(brick);
    return !bricks.some(brickIntersects(falling));
}

const sortBricks = (a: Brick, b: Brick) => Math.min(a[0][2], a[1][2]) - Math.min(b[0][2], b[1][2]);
const sortedBricks = bricks.sort(sortBricks);

const fallCycle = (): number => {
    let count = 0;
    for(let i = 0; i < sortedBricks.length; i++) {
        const brick = sortedBricks[i];
        if (canFall(brick, sortedBricks.slice(0, i))) {
            sortedBricks[i] = fall(brick);
            count++;
        }
    }
    return count;
}

const howManyCanFall = (bricks: Brick[]): number => {
    let count = 0;
    for(let i = 0; i < bricks.length; i++) {
        const remaining = bricks.slice(0, i).concat(bricks.slice(i + 1));
        if(!remaining.some((b, i) => canFall(b, remaining.slice(0, i)))) {
            count++;
        }
    }
    return count;
}

while(fallCycle() > 0) {
    //sortedBricks.sort(sortBricks);  // not sure if this is necessary.
    //console.log('falling');
}

console.log(howManyCanFall(sortedBricks));
