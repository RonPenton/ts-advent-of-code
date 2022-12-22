//https://adventofcode.com/2022/day/22
import { readFile } from "../../utils";
import { Coord, Direction, Grid, moveCoord, rotate } from "../../utils/grid";
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

const backTrack = (l: Coord, d: Direction, grid: Grid<L>) => {
    let n = l;
    while (grid.at(n) != ' ' && grid.at(n) !== undefined) {

        if (grid.at(n) === undefined) {
            console.log('bug!');
        }
        l = n;
        n = moveCoord(n, d);
    }
    return l;
}

type State = { d: Direction, l: Coord };
const simulateMove = (move: Move, grid: Grid<L>, { d, l }: State): State => {
    console.log(move);
    if (typeof move == 'number') {
        grid.set(l, glyphs[d] as L);
        for (let i = 0; i < move; i++) {
            let next = moveCoord(l, d);
            if (grid.at(next) == ' ' || grid.at(next) === undefined) {
                next = backTrack(l, rotate(d, 180), grid)
            }

            if (grid.at(next) == '#') {
                // grid.print();
                // console.log('------------------------------------');
                return { d, l };
            }
            l = next;
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
