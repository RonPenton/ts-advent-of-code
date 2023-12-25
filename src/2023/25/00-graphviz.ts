// https://adventofcode.com/2023/day/25

import { readLines, notEmpty } from "../../utils";
import { iter } from "../../utils/iter";
import fs from 'fs';

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Graph = Map<string, string[]>;

const parseLine = (s: string): [string, string[]] => {
    const [a, rest] = s.split(': ');
    return [a, rest.split(' ')];
}

const nodes = lines.map(parseLine);
const graph: Graph = new Map<string, string[]>();
nodes.forEach(([a, b]: [string, string[]]) => {
    let m = graph.get(a) ?? [];
    m = iter(m).concat(iter(b)).unique().array();
    graph.set(a, m);
});

const op = ['digraph {'];
for (const [a, b] of graph) {
    for (const c of b) {
        op.push(`${a} -> ${c};`);
    }
}
op.push('}');
fs.writeFileSync(`${__dirname}\\graph.dot`, op.join('\n'));

