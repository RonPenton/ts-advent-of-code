//https://adventofcode.com/2022/day/22
import { range, readFile } from "../../utils";
import { Coord, Direction, Directions, Grid, moveCoord, rotate } from "../../utils/grid";
const file = readFile(`${__dirname}\\01-input.txt`);

type Turn = 'R' | 'L';
type Move = Turn | number;
type L = '.' | ' ' | '#';

const parseMove = (s: string): Move => s == 'L' ? 'L' : s == 'R' ? 'R' : parseInt(s);
const parseMoves = (s: string) => s.split(/(\d+|[RL])/i).filter(x => !!x).map(parseMove);

const [map, instructions] = file.split(/\r\n\r\n/i);
const moves = parseMoves(instructions);

const mapLines = map.split(/\r\n/i);
const maxWidth = Math.max(...mapLines.map(x => x.length));

const pad = (width: number) => (line: string) => [...line, ...Array(width - line.length).fill(' ')];

const lines = mapLines.map(pad(maxWidth));
const grid = new Grid<L>(lines);

const start = grid.slice(0, 0, 1).find(x => x == '.')!;

const Rotations = {
    'L': -90,
    'R': 90
} as const;

const wrapkey = (d: Direction, [r, c]: Coord) => `${d}::${r},${c}`;
const wrapmap = new Map<string, [d: Direction, c: Coord]>();
const wrap = (d1: Direction, d2: Direction, r1: Coord[], r2: Coord[]) => {
    r1.forEach((c, i) => wrapmap.set(wrapkey(d1, c), [d2, r2[i]]));
    r2.forEach((c, i) => wrapmap.set(wrapkey(rotate(d2, 180), c), [rotate(d1, 180), r1[i]]));
}

const row = (r: number, cols: number[]): Coord[] => cols.map(c => [r, c]);
const col = (rows: number[], c: number): Coord[] => rows.map(r => [r, c]);

// 1
wrap('up', 'right', row(0, range(50, 100)), col(range(150, 200), 0));
wrap('left', 'right', col(range(0, 50), 50), col(range(150, 100), 0));
// 2
wrap('up', 'up', row(0, range(100, 150)), row(199, range(0, 50)));
wrap('right', 'left', col(range(0, 50), 149), col(range(150, 100), 99));
wrap('down', 'left', row(49, range(100, 150)), col(range(50, 100), 99));
// 3
wrap('left', 'down', col(range(50, 100), 50), row(100, range(0, 50)));
// 5
wrap('down', 'left', row(149, range(50, 100)), col(range(150, 200), 49));



type State = { d: Direction, l: Coord };
const simulateMove = (move: Move, grid: Grid<L>, { d, l }: State): State => {
    console.log(move);
    if (typeof move == 'number') {
        grid.set(l, glyphs[d] as L);
        for (let i = 0; i < move; i++) {

            let nextD = d;
            let next = moveCoord(l, d);
            const key = wrapkey(d, l);
            const wrap = wrapmap.get(key);
            if(wrap) {
                nextD = wrap[0];
                next = wrap[1];
            }

            if (grid.at(next) == ' ' || grid.at(next) === undefined) {
                console.log('bug!');
            }

            if (grid.at(next) == '#') {
                // grid.print();
                // console.log('------------------------------------');
                return { d, l };
            }
            l = next;
            d = nextD;
            grid.set(l, glyphs[d] as L);
        }
        // grid.print();
        // console.log('------------------------------------');
        return { d, l }
    }
    else {
        return { d: rotate(d, Rotations[move]), l };
    }
}

const facings: Record<string, number> = {
    'right': 0,
    'down': 1,
    'left': 2,
    'up': 3
};

const glyphs: Record<string, string> = {
    'right': '>',
    'down': 'v',
    'left': '<',
    'up': '^'
};

const end = moves.reduce<State>((state, move) => simulateMove(move, grid, state), { d: 'right', l: start.coord });
console.log(end);
const password = 1000 * (end.l[0] + 1) + 4 * (end.l[1] + 1) + facings[end.d];
grid.print();
console.log(password);
