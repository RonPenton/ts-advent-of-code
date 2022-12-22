//https://adventofcode.com/2020/day/20
import { filterIterable, findIterable, identity, mapIterable, range, readFile, readLines } from "../../utils";
import { Coord, Grid } from "../../utils/grid";
const text = readFile(`${__dirname}\\01-input.txt`);


const tilesText = text.split(/\r\n\r\n/i);

type Bit = '0' | '1';
const getBit = (s: string) => s[0] == '.' ? '0' : '1';
const parse = (s: string) => {
    const [tileLine, ...lines] = s.split('\r\n');
    const [_, tile] = /(\d+)/i.exec(tileLine)!;
    return [parseInt(tile), new Grid(lines.map(r => [...r].map(getBit)))] as const;
}

const val = (edge: Bit[]) => {
    // convert to a number and take the lower number to normalize flips.
    const v = [parseInt(edge.join(''), 2), parseInt(edge.reverse().join(''), 2)];
    return Math.min(...v);
}

const valRaw = (edge: Bit[]) => {
    return parseInt(edge.join(''), 2)
}

const rng = range(10);

const edgeSpans = (g: Grid<Bit>) => {
    return [
        rng.map(c => g.at([0, c])!),                        // top
        rng.map(r => g.at([r, g.width - 1])!),              // right
        rng.map(c => g.at([g.height - 1, c])!).reverse(),   // bottom
        rng.map(r => g.at([r, 0])!).reverse()                // left
    ]
}

const edges = (g: Grid<Bit>) => edgeSpans(g).map(val);
const edgesRaw = (g: Grid<Bit>) => edgeSpans(g).map(valRaw);

const tiles = new Map(tilesText.map(parse));

const map: Record<number, number[]> = {};
for (const [id, tile] of tiles.entries()) {
    edges(tile).map(x => map[x] = [...(map[x] ?? []), id]);
}

const makeLeftTopCorner = (tile: Grid<Bit>) => {
    let e = edges(tile).map(e => map[e].length == 2);
    while (e[1] == false || e[2] == false) {
        tile = tile.rotateRight();
        e = edges(tile).map(e => map[e].length == 2);
    }
    return tile;
}

const opposite = (initial: number, next: number): number | undefined => {
    const e = edges(tiles.get(next)!);
    const idx = e.map(e => map[e]).findIndex(t => t.includes(initial));
    return map[e[(idx + 2) % 2]].find(t => t != next);
}

const atDir = (initial: number, dir: number): number | undefined => {
    return map[edges(tiles.get(initial)!)[dir % 4]].find(t => t != initial);
}

const orientate = (initial: number, next: number, dir: number): Grid<Bit> => {
    const tile = tiles.get(initial)!;
    const er = edgesRaw(tile)[dir % 4];
    const e = edges(tile)[dir % 4];

    let g = tiles.get(next)!;
    if (edgesRaw(g).some(x => x == er)) {
        // edge-on-edge numbers should never match, means we'll have to flip the grid to get
        // it to the right state.
        g = g.flipVertical();   // flip vertical since it's faster.
    }

    if (edgesRaw(g).some(x => x == er)) {
        // debug check
        throw new Error('edge assumptions wrong');
    }

    while (edges(g)[(dir + 2) % 4] != e) {
        g = g.rotateRight();
    }

    return g;
}

const firstCorner = findIterable(tiles.entries(), ([_, tile]) => edges(tile).filter(x => map[x].length == 1).length == 2)!;
const firstTile = makeLeftTopCorner(firstCorner[1]);

const bigGrid = firstTile.slice(1, 1, 9, 9);

tiles.set(firstCorner[0], firstTile);

let rowStart: number | undefined = firstCorner[0];
let current: number | undefined = rowStart;

let row = 0;
let col = 0;

while (rowStart != undefined) {
    while (current != undefined) {
        col++;
        const next = atDir(current, 1);

        if (next !== undefined) {
            let g = orientate(current, next, 1);
            tiles.set(next, g);
            g = g.slice(1, 1, 9, 9);

            if (bigGrid.width < 8 * (col + 1)) {
                bigGrid.growCols(8, '0');
            }
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    bigGrid.set([r + row * 8, c + col * 8], g.at([r, c])!);
                }
            }
        }

        current = next;
    }

    const nextRow = atDir(rowStart, 2);
    if (nextRow !== undefined) {
        let g = orientate(rowStart, nextRow, 2);
        tiles.set(nextRow, g);
        g = g.slice(1, 1, 9, 9);

        row++;
        col = 0;
        if (bigGrid.height < 8 * (row + 1)) {
            bigGrid.growRows(8, '0');
        }
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                bigGrid.set([r + row * 8, c + col * 8], g.at([r, c])!);
            }
        }

        current = nextRow;
    }
    rowStart = nextRow;
}


const monster = [
    `                  # `,
    `#    ##    ##    ###`,
    ` #  #  #  #  #  #   `
];

const checkPatterns = monster.map(x => parseInt(x.replaceAll(' ', '0').replaceAll('#', '1'), 2));
const bin = (b: Bit[]) => parseInt(b.join(''), 2);

const sliceLen = monster[0].length;

const match = (_: Bit, r: number, c: number, g: Grid<Bit>) => {
    if (r > g.height - monster.length || c > g.width - sliceLen)
        return false;

    const a = range(3)
        .map(i => g.rowAt(r + i)!.slice(c, c + sliceLen))
        .map(bin)
        .map((n, i) => n & checkPatterns[i])
        .every((n, i) => n == checkPatterns[i]);

    if (a == true) {
        console.log([r, c]);
    }

    return a;
}

const [g, matches] = range(4).flatMap(n => {
    let g = bigGrid.slice();
    for (let i = 0; i < n; i++) {
        g = g.rotateRight();
    }

    return [g, g.flipHorizontal(), g.flipVertical()];
}).map(g => [g, g.filter(match)] as const).find(([g, m]) => m.length > 0)!;

console.log(matches.length);

let copy: Grid<string> = g.slice();

const mon = new Grid(monster.map(x => [...x]));
const m = matches.map(x => x.coord);
for (const [r, c] of m) {
    mon.forEach((v, ri, ci) => {

        if (v == '#' && g.at([r + ri, c + ci]) != '1') {
            console.log('BUG!');
        }

        if (v == '#') copy.set([r + ri, c + ci], 'O');
    });
}

copy = copy.map((v) => v == '0' ? '.' : v == '1' ? '#' : 'O');

const ohashes = g.filter(x => x == '1').length;
const hashes = copy.filter(x => x == '#').length;
const os = copy.filter(x => x == 'O').length;

console.log(hashes);
//copy.print(identity);
g.map(v => v == '0' ? '.' : v == '1' ? '#' : 'O').print(identity);
