// https://adventofcode.com/2023/day/24

import { readLines, notEmpty, range, add } from "../../utils";
import { Coord3, parseCoord3 } from "../../utils/coord3";
import { iter } from "../../utils/iter";
import Big from 'big.js';

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Hailstone = { location: Coord3, velocity: Coord3 };
type NormalizedHailstone = Hailstone & { offset: Coord3 };

type BigCoord = [Big, Big];
type BigCoord3 = [Big, Big, Big];

const parseHailstone = (s: string): Hailstone => {
    const [location, velocity] = s.split(' @ ').map(parseCoord3);
    return { location, velocity };
}

const hailstones = lines.map(parseHailstone);

const bigEqCoord = (a: BigCoord, b: BigCoord): boolean => {
    // soo.. floating point errors. FML. Pick a threshold that's "close enough" and hope
    // it doesn't trigger any out of bounds errors.
    const dx = a[0].minus(b[0]).abs().toNumber();
    const dy = a[1].minus(b[1]).abs().toNumber();
    return dx < 50 && dy < 50;
}

/**
 * Rewritten for linalg.
 * @param a 
 * @param b 
 * @returns 
 */
const intersectXY = (a: Hailstone, b: Hailstone): BigCoord | undefined => {
    const { location: [x1, y1], velocity: [vx1, vy1] } = a;
    const { location: [x2, y2], velocity: [vx2, vy2] } = b;

    // standard equation of a line 
    // ax + by = c

    // our data is in the form of
    // (x + vx * t, y + vy * t)

    // px = x + vx * t -> t = (px - x)/vx
    // py = y + vy * t -> t = (py - y)/vy
    // (px - x)/vx = (py - y)/vy
    // vy(px - x) = vx(py - y)
    // vypx - vyx = vxpy - vxy
    // vypx - vxpy = vyx - vxy
    // a = vy, b = -vx, c = vyx - vxy

    const [a1, b1, c1] = [vy1, -vx1, vy1 * x1 - vx1 * y1];
    const [a2, b2, c2] = [vy2, -vx2, vy2 * x2 - vx2 * y2];

    // parallel. a1/b1 == a2/b2, using multiplication to avoid floating point errors. 
    if (a1 * b2 == a2 * b1)
        return undefined;

    // a1x + b1y = c1
    // a2x + b2y = c2
    // solve for x:
    // a1xb2 + b1yb2 = c1b2  -> b1b2y = c1b2 - a1b2x 
    // a2xb1 + b2yb1 = c2b1  -> b1b2y = c2b1 - a2b1x

    // c1b2 - a1b2x = c2b1 - a2b1x
    // c1b2 - c2b1 = a1b2x - a2b1x
    // c1b2 - c2b1 = (a1b2 - a2b1)x
    // x = (c1b2 - c2b1)/(a1b2 - a2b1)

    // FFS. JS floating point errors.
    const bc1 = Big(c1);
    const bc2 = Big(c2);
    const ba1 = Big(a1);
    const ba2 = Big(a2);
    const bb1 = Big(b1);
    const bb2 = Big(b2);
    const x = (bc1.times(bb2).minus(bc2.times(bb1))).div(ba1.times(bb2).minus(ba2.times(bb1)));
    //const x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);

    // solve for y:
    // a1x + b1y = c1
    // a2x + b2y = c2
    // 
    // a1a2x + b1a2y = c1a2  ->  a1a2x = c1a2 - b1a2y
    // a2a1x + b2a1y = c2a1  ->  a1a2x = c2a1 - b2a1y
    // c1a2 - b1a2y = c2a1 - b2a1y
    // c1a2 - c2a1 = b1a2y - b2a1y
    // c1a2 - c2a1 = (b1a2 - b2a1)y
    // y = (c1a2 - c2a1)/(b1a2 - b2a1)

    //const y = (c1 * a2 - c2 * a1) / (b1 * a2 - b2 * a1);
    const y = (bc1.times(ba2).minus(bc2.times(ba1))).div(bb1.times(ba2).minus(bb2.times(ba1)));

    // if (x < min || x > max || y < min || y > max)
    //     return undefined;

    const t1 = (x.toNumber() - x1) / vx1;
    const t2 = (x.toNumber() - x2) / vx2;
    // Looking forward in time...
    if (t1 < 0 || t2 < 0)
        return undefined;


    return [x, y];
}

const solveForT = (a: Hailstone, b: BigCoord): Big => {
    const { location: [x1, y1], velocity: [vx1, vy1] } = a;
    const [x2, y2] = b;
    return vx1 == 0 ? y2.minus(y1).div(vy1) : x2.minus(x1).div(vx1);
}

/**
 * We're going to brute force the answer instead of using a linalg library. LOL.
 * So basically to simplify the math we're normalizing hailstones with an additional
 * velocity to negate the thrown rock's velocity, allowing us to treat it as stationary.
 * NormalizedHailstone... not strictly functional. But since we're brute forcing
 * this I don't want to create 8 billion copies in memory, just iterate it in place.
 * Not pretty but faster and functional.
 * @param a 
 * @param velocity 
 */
const normalize = (a: NormalizedHailstone, offset: Coord3): Hailstone => {
    a.velocity[0] -= offset[0] - a.offset[0];
    a.velocity[1] -= offset[1] - a.offset[1];
    a.velocity[2] -= offset[2] - a.offset[2];
    a.offset = offset;
    return a;
}

const solveForZ = (a: Hailstone, b: Hailstone, intersection: BigCoord): Big | undefined => {
    // z = z1 + t1*(vz1-az)
    // z = z2 + t2*(vz2-az)
    // (z1 - z2 + t1*vz1 - t2*vz2)/(t1 - t2) =  az

    const { location: [, , z1], velocity: [, , vz1] } = a;
    const { location: [, , z2], velocity: [, , vz2] } = b;

    const t1 = solveForT(a, intersection);
    const t2 = solveForT(b, intersection);
    if (t1 == t2) return undefined;

    // z1 - z2 + t1*vz1 - t2*vz2 / t1 - t2
    return (Big(z1).minus(z2).plus(t1.times(vz1)).minus(t2.times(vz2))).div((t1.minus(t2)));
}

const signs = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
] as const;
let kill = 0;
const brute = (hailstones: Hailstone[]): undefined | BigCoord3 => {

    const hs: NormalizedHailstone[] = hailstones.map(h => ({ ...h, offset: [0, 0, 0] }));

    // going to brute force the number, spiral outwards from 0,0.
    let n = 0;
    while (true) {
        const rn = range(n + 1);
        for (const x of rn) {
            const y = n - x;
            if (kill > 0) {
                console.log(`Killed ${kill}`);
                return;
            }
            if (x == 196 && y == 109) {
                kill++;
                debugger;
            }
            for (const [sx, sy] of signs) {
                const ax = x * sx;
                const ay = y * sy;
                const h1 = hs[0]
                normalize(h1, [ax, ay, 0])
                let intersection: BigCoord | undefined = undefined;
                let p: BigCoord | undefined = undefined;
                for (const h2 of iter(hs).skip(1)) {
                    normalize(h2, [ax, ay, 0]);
                    p = intersectXY(h1, h2);

                    // no xy intersection at all, so there cannot possibly be a z intersection either.
                    if (p === undefined)
                        break;

                    if (intersection === undefined) {
                        intersection = p;
                        continue;
                    }

                    if (!bigEqCoord(p, intersection)) {
                        if (kill > 0) debugger;
                        break;
                    }
                }

                if (p === undefined || intersection == undefined || !bigEqCoord(p, intersection))
                    continue;

                // went through the entire list of hailstones and they all intersected
                // at the same point.

                let az: Big | undefined = undefined;
                let nz: Big | undefined = undefined;

                for (const h2 of iter(hs).skip(1)) {
                    nz = solveForZ(h1, h2, intersection);
                    if (az === undefined) {
                        az = nz;
                        continue;
                    }
                    else if (nz !== undefined && !(nz.minus(az).toNumber() < 0.001)) {
                        return undefined;
                    }
                }
                if (az !== undefined && nz !== undefined && (nz.minus(az).toNumber() < 0.001)) {
                    const h = hailstones[0];
                    // const z = h.location[2] + solveForT(h, intersection) * (h.velocity[2] - az);
                    const z = Big(h.location[2]).add(solveForT(h, intersection).times(Big(h.velocity[2]).minus(az)));
                    return [intersection[0], intersection[1], z];
                }
            }
        }
        n += 1;
    }
}


const solved = brute(hailstones)!;
const answer = solved[0].add(solved[1]).add(solved[2]);
//console.log(solved.toString());
console.log(answer.toString());
