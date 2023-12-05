// https://adventofcode.com/2023/day/5

import {
    readLines,
    notEmpty,
    iterateRegex,
    Range, rangesIntersection, rangeOffset, rangesSubtract, rangesUnion
} from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);
const [seedLine, ...rest] = lines;
const seeds: Range[] = [...iterateRegex(/(\d+) (\d+)/g, seedLine.split(':')[1])]
    .map(x => [Number(x[1]), Number(x[1]) + Number(x[2])]);

// example uses confusing nomenclature.
// seed = source
// soil = destination

type SeedRange = {
    destination: number;
    source: number;
    range: number;
}

type ParsedMap = {
    from: string;
    to: string;
    ranges: SeedRange[];
}

function* parseMaps(lines: string[]) {
    let map: ParsedMap | undefined;

    for (const line of lines) {
        const reg = /(\w+)-to-(\w+) map/i;
        const match = reg.exec(line);
        if (match) {
            if (map) yield map;
            map = { from: match[1], to: match[2], ranges: [] };
        }
        else if (map !== undefined) {
            const [destination, source, range] = line.split(' ').map(Number);
            map.ranges.push({ destination, source, range });
        }
    }

    if (map) yield map;
}

const mapRange = (map: ParsedMap, seeds: Range[]): Range[] => {
    const { ranges } = map;
    let untestedRanges: Range[] = [...seeds];
    let results: Range[] = [];

    for (const range of ranges) {
        if (!untestedRanges.length) break;

        const { destination, source, range: r } = range;
        const sourceRange = [source, source + r] as const;
        const intersects = rangesIntersection(untestedRanges, [sourceRange]);
        if (intersects.length > 0) {
            results.push(...intersects.map(rangeOffset(destination - source)));
            untestedRanges = rangesSubtract(untestedRanges, sourceRange);
        }
    }

    return rangesUnion([...results, ...untestedRanges]);
}

const computeRanges = (position: string, maps: Map<string, ParsedMap>, seeds: Range[]): Range[] => {
    const entry = maps.get(position);
    if (!entry) return seeds;
    return computeRanges(entry.to, maps, mapRange(entry, seeds));
}

const maps = [...parseMaps(rest)];
const sourceMap: Map<string, ParsedMap> = new Map(maps.map(m => [m.from, m]));
const solutionRanges = seeds.flatMap(seed => computeRanges('seed', sourceMap, [seed]));
const lowest = Math.min(...solutionRanges.map(r => r[0]));
console.log(lowest);
