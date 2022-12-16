//https://adventofcode.com/2022/day/16
import { defined, difference, intersection, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const reg = /Valve (\w\w) has flow rate=(\d+); .* to valves? (.*)/i

type Valve = {
    rate: number;
    tunnels: string[];
    open: boolean;
}

const parse = (s: string) => reg.exec(s)!;
const form = ([_, name, rate, tunnels]: string[]): [string, Valve] => ([name, { rate: parseInt(rate), tunnels: tunnels.split(', '), open: false }]);

const valves = Object.fromEntries(lines.map(parse).map(form));
type Valves = typeof valves;

const keys = Object.keys(valves);

const bfs = (valves: Valves, from: string, to: string) => {
    const visited = new Map<string, number>([[from, 0]]);
    const queue = [from];


    while (true) {
        const node = queue.shift()!;
        const length = visited.get(node)!;
        const valve = valves[node];
        for (const exit of valve.tunnels) {
            if (exit == to) return length + 1;
            if (visited.has(exit)) continue;
            visited.set(exit, length + 1);
            queue.push(exit);
        }
    }

    return -1;
}

const graph = Object.fromEntries(keys.map(k => [k, {
    ...valves[k],
    tunnels: Object.fromEntries(keys.filter(l => k != l).map(l => [l, bfs(valves, k, l)] as const))
}]));

type Graph = typeof graph;

const memos = new Map<string, string>();

const memoize = (remaining: Set<string>, at: string, timeLeft: number, answer?: string) => {
    const key = `${[...remaining].sort().join(',')}::${at}::${timeLeft}`;

    if (answer) {
        memos.set(key, answer);
        return;
    }
    return memos.get(key);
}

const solve = (graph: Graph, remaining: Set<string>, at = 'AA', rate = 0, released = 0, timeLeft = 30): number => {
    if (timeLeft <= 0) return released;

    const valve = graph[at];
    rate += valve.rate;

    if (timeLeft >= 25)
        console.log(`Examining ${at}, rate: ${rate}, remaining: ${[...remaining]}, released: ${released}, time: ${timeLeft}`);

    let picks: Set<string>;
    const answer = memoize(remaining, at, timeLeft);
    if (answer) {
        picks = new Set([answer]);
    }
    else {
        picks = intersection(remaining, new Set(Object.keys(valve.tunnels)));
    }

    const vals = [...picks].map(pick => {
        const length = valve.tunnels[pick] + 1;
        if (length >= timeLeft) return null; // can't get there before time runs out, discard.

        const diff = difference(remaining, new Set([pick]));
        return [pick, solve(graph, diff, pick, rate, released + (rate * length), timeLeft - length)] as const;
    }).filter(defined);

    if (vals.length == 0) {
        return released + (rate * timeLeft);
    }

    const sorted = vals.sort((a, b) => b[1] - a[1]);
    if (!answer) {
        memoize(remaining, at, timeLeft, sorted[0][0]);
    }
    return sorted[0][1];
}

const keySet = Object.keys(graph).filter(x => graph[x].rate > 0);
const answer = solve(graph, new Set(keySet));

console.log(answer);

