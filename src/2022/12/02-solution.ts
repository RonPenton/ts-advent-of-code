//https://adventofcode.com/2022/day/12
import { addCoord, Coord, defined, gridFilter, gridFind, gridMap, range, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Node = {
    location: Coord;
    height: number;
    exits: (Coord | null)[];
    trait: string;
}

const coord = ([r, c]: Coord) => `${r},${c}`;

const num = (s: string) => s.charCodeAt(0) & 31;
const getHeight = (s: string) => s == 'S' ? 'a' : s == 'E' ? 'z' : s;
const dirs: Coord[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const getDir = (height: number, width: number) => (dir: number, t: Coord): Coord | null => {
    const [r, c] = addCoord(t, dirs[dir]);
    if (r < 0 || r >= height || c < 0 || c >= width) return null;
    return [r, c];
}
type GetDir = ReturnType<typeof getDir>;

const node = (g: GetDir, r: number, c: number, s: string): Node => ({
    location: [r, c],
    height: num(getHeight(s)),
    exits: range(4).map(d => g(d, [r, c])),
    trait: s
});

const initialGrid = lines.map(l => Array.from(l));
const height = initialGrid.length;
const width = initialGrid[0].length;
const $getDir = getDir(height, width);
const grid = gridMap(initialGrid, (r, c, v) => node($getDir, r, c, v));

const { coord: start } = gridFind(grid, (_, __, v) => v.trait == 'S')!;
const { coord: end } = gridFind(grid, (_, __, v) => v.trait == 'E')!;

const bfs = (grid: Node[][], starts: Coord[], end: Coord) => {
    const marked = new Map<string, number>(starts.map(x => [coord(x), 0]));
    const looking: Coord[] = [...starts];

    let current: Coord | undefined = looking.pop()!;
    marked.set(coord(current), length);

    while (current) {
        const length = marked.get(coord(current))!;
        const c = grid[current[0]][current[1]];
        const exits = c.exits
            .filter(defined)
            .filter(e => grid[e[0]][e[1]].height - c.height <= 1);

        for (const exit of exits) {
            const m = coord(exit);
            if (!marked.has(m)) {
                marked.set(coord(exit), length + 1);
                looking.push(exit);
            }
        }

        current = looking.shift();
    }

    console.log(marked.get(coord(end)));
}

const starts = gridFilter(grid, (_, __, v) => v.height == 1);
bfs(grid, starts, end);
