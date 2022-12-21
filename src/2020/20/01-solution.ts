//https://adventofcode.com/2020/day/20
import { filterIterable, mapIterable, range, readFile, readLines } from "../../utils";
import { Grid } from "../../utils/grid";
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

const rng = range(10);

const edges = (g: Grid<Bit>) => {
    return [
        rng.map(c => g.at([0, c])!),                        // top
        rng.map(r => g.at([r, g.width - 1])!),              // right
        rng.map(c => g.at([g.height - 1, c])!).reverse(),   // bottom
        rng.map(r => g.at([r, 0])!).reverse()                // left
    ].map(val);
}

const tiles = new Map(tilesText.map(parse));

const map: Record<number, number[]> = {};
for (const [id, tile] of tiles.entries()) {
    edges(tile).map(x => map[x] = [...(map[x] ?? []), id]);
}

const e: number[] = [];

const answer = filterIterable(tiles.entries(), ([_, tile]) => edges(tile).filter(x => map[x].length == 1).length == 2);
let a = 1;
for(const [id] of answer) {
    a *= id;
}

console.log(a);
