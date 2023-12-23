// https://adventofcode.com/2023/day/23

const startTime = Date.now();

import { readLines, notEmpty } from "../../utils";
import { Coord, Grid, OrthogonalDirections, eqCoord, moveCoord, parseCoord, printCoord } from "../../utils/grid";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Tile = '#' | '.';

const map = Grid.fromLines(lines, c => c !== '#' ? '.' : '#');

const [start, end] = map.filter((t, r, c) => (r == 0 || r == map.height - 1) && t == '.')
    .map(({ coord }) => coord);

const validMoves = (map: Grid<Tile>, coord: Coord) => {
    return OrthogonalDirections
        .map(dir => [dir, moveCoord(coord, dir)] as const)
        .filter(([_, c]) => {
            const at = map.at(c);
            if (at === undefined || at === '#') return false;
            return true;
        })
        .map(([_, c]) => c);
}

type Graph = Map<string, Map<string, number>>;

const getGraph = (start: Coord, end: Coord): Graph => {
    const graph: Graph = new Map<string, Map<string, number>>();
    graph.set(printCoord(start), new Map());
    graph.set(printCoord(end), new Map());

    const junctions = map.filter((t, r, c) => {
        if (t == '#') return false;
        return validMoves(map, [r, c]).length > 2;
    });

    junctions.forEach(({ coord }) => graph.set(printCoord(coord), new Map()));
    console.log(junctions.length);

    const bfs = (startStr: string) => {
        type State = [Coord, number];
        const start = parseCoord(startStr);
        const startMap = graph.get(startStr)!;
        const seen = new Set<string>();
        const looking: State[] = [[start, 0]];
        while (looking.length > 0) {
            const [c, d] = looking.shift()!;
            const k = printCoord(c);
            if (seen.has(k)) continue;
            seen.add(k);

            const destMap = graph.get(k);
            if (destMap && k != startStr) {
                destMap.set(printCoord(start), d);
                startMap.set(k, d);
                continue;
            }

            const moves = validMoves(map, c);
            looking.push(...moves.map(m => [m, d + 1] as State));
        }
    }

    graph.forEach((_, k) => bfs(k));
    return graph;
}

let max = 0;

const dfs = (
    graph: Graph,
    start: Coord,
    end: Coord,
    dist: number = 0,
    seen: Set<string> = new Set<string>): number => {

    const k = printCoord(start);
    if (eqCoord(start, end)) {
        if (dist > max) {
            console.log(`new max: ${dist}`);
            max = dist;
        }
        return dist;
    }

    if (seen.has(k))
        return 0;

    seen.add(k)
    const edges = graph.get(k)!;
    const results = iter(edges.entries())
        .map(([coordStr, d]) => dfs(graph, parseCoord(coordStr), end, dist + d, seen))
        .array();

    seen.delete(k);

    return Math.max(...results);
}

const g = getGraph(start, end);
const m = dfs(g, start, end);
console.log(`max: ${m}`);

const endTime = Date.now();
console.log(`Script took ${(endTime - startTime) / 1000}s.`);
