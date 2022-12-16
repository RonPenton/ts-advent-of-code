//https://adventofcode.com/2022/day/16
import { defined, difference, intersection, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-sample.txt`);

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
}

const graph = Object.fromEntries(keys.map(k => [k, {
    ...valves[k],
    tunnels: Object.fromEntries(keys.filter(l => k != l).map(l => [l, bfs(valves, k, l)] as const))
}]));

type Path = {
    remaining: Set<string>,
    at: string,
    released: number,
    steps: string[]
};

const keySet = new Set(Object.keys(graph).filter(x => graph[x].rate > 0));
const path: Path = { remaining: keySet, at: 'AA', released: 0, steps: [] };

const solve = (path: Path, rate = 0, timeLeft = 26): Path[] => {
    if (timeLeft <= 0) return [path];

    const valve = graph[path.at];
    rate += valve.rate;

    let picks: Set<string>;
    picks = intersection(path.remaining, new Set(Object.keys(valve.tunnels)));

    const vals = [...picks].flatMap(at => {
        const length = valve.tunnels[at] + 1;
        if (length >= timeLeft) return null; // can't get there before time runs out, discard.

        const diff = difference(path.remaining, new Set([at]));
        const p: Path = { remaining: diff, at, released: path.released + (rate * length), steps: [...path.steps, at] }
        return solve(p, rate, timeLeft - length);
    }).filter(defined);

    if (vals.length == 0) {
        return [{ ...path, released: path.released + (rate * timeLeft) }];
    }

    return vals;
}

const paths = solve(path);

let max = 0;

for (let me = 0; me < paths.length; me++) {
    for (let elephaunt = me + 1; elephaunt < paths.length; elephaunt++) {

        // only look at paths where me and the elephaunt do not open the same valves.
        if (paths[me].steps.every(s => !paths[elephaunt].steps.includes(s))) {
            if (paths[me].released + paths[elephaunt].released > max) {
                max = paths[me].released + paths[elephaunt].released;
            }
        }
    }
}

console.log(max);
