// https://adventofcode.com/2023/day/16

import { readLines, notEmpty, Coord } from "../../utils";
import { Angle, Direction, Grid, angleOfDirection, moveCoord, normalizeAngle, parseCoord, printCoord, rotate } from "../../utils/grid";

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
    if(t == '.')
        return [d];
    return reflect(d, t);
}

const seenKey = (c: Coord, d: Direction) => `${c[0]},${c[1]},${d}`;
const seen = new Set<string>();

// Direction is for debugging. 
const visited = new Map<string, { n: number, d: Direction }>();

const start: Coord = [0, 0]
const startDirection = 'right';

const grid = Grid.fromLines(lines, x => x as Mirror);

const tracePath = (grid: Grid<Tile>, start: Coord, d: Direction) => {
    let c = start;
    while (grid.in(c)) {
        const sk = seenKey(c, d);
        const vk = printCoord(c);
        if (seen.has(sk)) {
            // bail out, already done this one. 
            return;
        }
        seen.add(sk);
        const v = visited.get(vk) ?? { n: 0, d };
        visited.set(vk, { n: v.n + 1, d: v.d });

        const t = grid.at(c)!;
        const [next, ...rest] = nextDirection(d, t);

        // cutting down on recursion because node doesn't tail-recurse (sigh...)
        // so we only recurse when we get a split. Otherwise it's a loop. 
        // node would be the perfect functional platform if it had tail-recursion...
        for(const n of rest) {
            tracePath(grid, moveCoord(c, n), n);
        }
        d = next;
        c = moveCoord(c, d);
    }
}

tracePath(grid, start, startDirection);

const makeDebugGrid = (grid: Grid<Tile>): Grid<string> => {

    const dirs: any = {
        'up': '↑',
        'down': '↓',
        'left': '←',
        'right': '→',
    }

    const cl: Grid<string> = grid.clone();
    for(const [k, v] of visited.entries()) {
        const [r, c] = parseCoord(k);
        cl.set([r, c], `${v.n > 1 ? v.n : dirs[v.d]}`);
    }

    return cl;
}

const debugGrid = makeDebugGrid(grid);
debugGrid.print();
console.log(visited.size);