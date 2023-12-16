// https://adventofcode.com/2023/day/16

import { readLines, notEmpty, Coord, sortNumberRev } from "../../utils";
import { Angle, Direction, Grid, angleOfDirection, eqCoord, moveCoord, normalizeAngle, parseCoord, printCoord, rotate } from "../../utils/grid";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const mirrors = ['-', '|', '/', '\\'] as const;
type Mirror = typeof mirrors[number];

type Tile = Mirror | '.';

const angles: Record<Mirror, [Angle, Angle]> = {
    '-': [0, 180],
    '/': [45, -135],
    '|': [90, -90],
    '\\': [135, -45],
}

const reflect = (d: Direction, m: Mirror): Direction[] => {
    // calculate the reflection angle
    const da = angleOfDirection(d);
    const mas = angles[m];

    const diff = mas.map(ma => normalizeAngle(da - ma)).find(a => Math.abs(a) <= 90)!;

    // parallel to the mirror, no reflection
    if (diff == 0) return [d];

    // perpendicular to the mirror, reflect in two directions
    if (Math.abs(diff) == 90) return [rotate(d, -90), rotate(d, 90)];

    if (diff == 45) return [rotate(d, 90)];
    if (diff == -45) return [rotate(d, -90)];

    throw new Error('something\'s wrong');
}

const nextDirection = (d: Direction, t: Tile): Direction[] => {
    if (t == '.')
        return [d];
    return reflect(d, t);
}

const seenKey = (c: Coord, d: Direction) => `${c[0]},${c[1]},${d}`;

const grid = Grid.fromLines(lines, x => x as Mirror);

const tracePath = (
    grid: Grid<Tile>,
    start: Coord,
    d: Direction,
    visited: Map<string, number> = new Map(),
    seen: Set<string> = new Set(),
) => {

    let c = start;
    while (grid.in(c)) {
        const sk = seenKey(c, d);
        const vk = printCoord(c);
        if (seen.has(sk)) {
            // bail out, already done this one. 
            return visited.size;
        }
        seen.add(sk);
        const v = visited.get(vk) ?? 0;
        visited.set(vk, v + 1);

        const t = grid.at(c)!;
        const [next, ...rest] = nextDirection(d, t);

        // cutting down on recursion because node doesn't tail-recurse (sigh...)
        // so we only recurse when we get a split. Otherwise it's a loop. 
        // node would be the perfect functional platform if it had tail-recursion...
        for (const n of rest) {
            tracePath(grid, moveCoord(c, n), n, visited, seen);
        }
        d = next;
        c = moveCoord(c, d);
    }
    return visited.size;
}

/**
 * Should break this out and put it in the standard lib.
 * @param grid 
 */
function* edges(grid: Grid<Tile>): Generator<[Coord, Direction]> {
    let c: Coord = [0, 0];
    let d: Direction = 'right';
    while (true) {
        yield [c, rotate(d, 90)];

        if (eqCoord(c, [0, 0]) && d === 'up') {
            break;
        }

        let n = moveCoord(c, d);
        if (!grid.in(n)) {
            d = rotate(d, 90);
            n = moveCoord(c, d);

            // corners are duplicated
            yield[c, rotate(d, 90)];
        }
        c = n;
    }
}

const max = iter(edges(grid))
    .map(([c, d]) => tracePath(grid, c, d))
    .array()
    .sort(sortNumberRev)[0];

console.log(max);