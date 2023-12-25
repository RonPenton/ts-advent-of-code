// https://adventofcode.com/2023/day/24

import { readLines, notEmpty } from "../../utils";
import { Coord3, parseCoord3 } from "../../utils/coord3";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);
const min = 200000000000000;
const max = 400000000000000;

type Hailstone = { location: Coord3, velocity: Coord3 };

const parseHailstone = (s: string): Hailstone => {
    const [location, velocity] = s.split(' @ ').map(parseCoord3);
    return { location, velocity };
}

const hailstones = lines.map(parseHailstone);

const hailstonesIntersect = (a: Hailstone, b: Hailstone): boolean => {
    const { location: [x1, y1], velocity: [vx1, vy1] } = a;
    const { location: [x2, y2], velocity: [vx2, vy2] } = b;

    // y = mx + b
    // y = (vy/vx)x + b
    // y = (vy/vx)x + (y - mx)
    // m1x + b1 = m2x + b2
    // m1x - m2x = b2 - b1
    // x(m1 - m2) = b2 - b1
    // x = (b2 - b1)/(m1 - m2)
    // 

    // looked at input data, no vx values of 0. 
    const [m1, m2] = [vy1 / vx1, vy2 / vx2];
    const [b1, b2] = [y1 - m1 * x1, y2 - m2 * x2];

    // slopes are identical and therefore parallel, so they never intersect. 
    if (m1 == m2)
        return false;

    const x = (b2 - b1) / (m1 - m2);
    const y = m1 * x + b1;

    const t1 = (x - x1) / vx1;
    const t2 = (x - x2) / vx2;

    // Looking forward in time...
    if(t1 < 0 || t2 < 0)
        return false;

    // collides outside the allowed boundary. 
    if (x < min || x > max || y < min || y > max)
        return false;

    console.log(`intersect at (${x},${y})`);
    return true;
}


const solved = iter(hailstones).combinations().filter(([a, b]) => hailstonesIntersect(a, b)).count();
console.log(solved);
