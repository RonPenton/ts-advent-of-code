// https://adventofcode.com/2023/day/22

import { cloneDeep } from "lodash";
import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Coord3 = [x: number, y: number, z: number];
type BrickCoords = [Coord3, Coord3];
type Brick = { key: string, coords: BrickCoords };

let keyCounter = 0;
const parseLine = (line: string): Brick => {
    return { key: String(keyCounter++), coords: line.split('~').map(a => a.split(',').map(Number) as Coord3) as BrickCoords };
}

const bricks = lines.map(parseLine);

const brickIntersects = (a: Brick) => (b: Brick) => {
    const { coords: [a1, a2] } = a;
    const { coords: [b1, b2] } = b;
    return (
        (a1[0] <= b2[0] && a2[0] >= b1[0]) &&
        (a1[1] <= b2[1] && a2[1] >= b1[1]) &&
        (a1[2] <= b2[2] && a2[2] >= b1[2])
    );
}

const fall = (brick: Brick): Brick => {
    const { key, coords: [[x1, y1, z1], [x2, y2, z2]] } = brick;
    return { key, coords: [[x1, y1, z1 - 1], [x2, y2, z2 - 1]] };
}

const canFall = (brick: Brick, bricks: Brick[]): boolean => {
    const { coords: [[, , z1], [, , z2]] } = brick;
    if (z1 == 1 || z2 == 1) return false;
    const falling = fall(brick);
    return !bricks.some(brickIntersects(falling));
}

const sortBricks = (a: Brick, b: Brick) => Math.min(a.coords[0][2], a.coords[1][2]) - Math.min(b.coords[0][2], b.coords[1][2]);
const sortedBricks = bricks.sort(sortBricks);

const fallCycle = (bricks: Brick[], set: Set<string>): number => {
    let count = 0;
    for (let i = 0; i < bricks.length; i++) {
        let brick = bricks[i];
        const remaining = bricks.slice(0, i);
        while(canFall(brick, remaining)) {
            brick = fall(brick)
            bricks[i] = brick;
            set.add(brick.key);
            count++;
        }
    }
    return count;
}

const simulateFall = (bricks: Brick[]): number => {
    const set = new Set<string>();
    while (fallCycle(bricks, set) > 0) {
        //console.log('falling');
    }
    return set.size;
}

const howManyCanFall = (bricks: Brick[]): number => {
    let count = 0;
    for (let i = 0; i < bricks.length; i++) {
        const remaining = cloneDeep(bricks.slice(0, i).concat(bricks.slice(i + 1)));

        const c = simulateFall(remaining);
        count += c;
    }
    return count;
}


console.log(`${simulateFall(sortedBricks)} bricks fell`);

console.log(howManyCanFall(sortedBricks));
