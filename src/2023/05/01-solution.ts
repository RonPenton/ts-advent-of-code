// https://adventofcode.com/2023/day/5

import { readLines, notEmpty, iterateRegex, range, between } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const [seedLine, ...rest] = lines;

const seeds = [...iterateRegex(/\d+/g, seedLine.split(':')[1])].map(Number);

// example uses confusing nomenclature.
// seed = source
// soil = destination

type Range = {
    destination: number;
    source: number;
    range: number;
}

type ParsedMap = {
    from: string;
    to: string;
    ranges: Range[];
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

const mapValue = (map: ParsedMap, input: number): number => {
    const { ranges } = map;
    for (const range of ranges) {
        const { destination, source, range: r } = range;
        if (between([source, source + r - 1])(input)) {
            return input + (destination - source);
        };
    }
    return input;
}

const computeValue = (position: string, maps: Map<string, ParsedMap>, seed: number): number => {
    const entry = maps.get(position);
    if (!entry) return seed;
    return computeValue(entry.to, maps, mapValue(entry, seed));
}

const maps = [...parseMaps(rest)];
const sourceMap: Map<string, ParsedMap> = new Map(maps.map(m => [m.from, m]));

const solutions = seeds.map(seed => computeValue('seed', sourceMap, seed));
const lowest = Math.min(...solutions);
console.log(lowest);
