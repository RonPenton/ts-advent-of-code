// https://adventofcode.com/2023/day/25

import { readLines, notEmpty } from "../../utils";
import { iter } from "../../utils/iter";
import 'regenerator-runtime/runtime.js';
const mincut = require('@graph-algorithm/minimum-cut');

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

    for(const c of b) {
        let n = graph.get(c) ?? [];
        n = iter(n).concat(iter([a])).unique().array();
        graph.set(c, n);
    }
});

let edges: [string, string][] = [];
for(const [a, b] of graph) {
    for(const c of b) {
        edges.push([a, c]);
    }
}

const cuts = [...mincut.mincut(edges)];
console.log(cuts);
for(const [a,b] of cuts) {
    const ae = iter(graph.get(a)!).filter(x => x !== b).array();
    const be = iter(graph.get(b)!).filter(x => x !== a).array();
    graph.set(a, ae);
    graph.set(b, be);
}

const bfs = (start: string): number => {
    let size = 0;
    const queue = [start]
    const visited = new Set<string>();
    while(queue.length > 0) {
        const node = queue.shift()!;
        if(visited.has(node)) {
            continue;
        }
        visited.add(node);
        size++;
        const children = graph.get(node)!;
        for(const child of children) {
            queue.push(child);
        }
    }
    return size;
}

const group1 = bfs(cuts[0][0]);
const group2 = bfs(cuts[0][1]);

console.log(`group1: ${group1}, group2: ${group2}`);
console.log(group1 * group2)
