// https://adventofcode.com/2023/day/20

import { readLines, notEmpty } from "../../utils";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Signal = 'high' | 'low';

const flip = (signal: Signal): Signal => signal === 'high' ? 'low' : 'high';

type SignalInstance = { from: string, to: string, signal: Signal };

type ModuleDefs = {
    'b': { type: 'b'; id: string, outputs: string[] };
    'f': { type: 'f'; id: string; value: Signal; outputs: string[]; };
    'c': { type: 'c'; id: string; inputs: Map<string, Signal>; outputs: string[]; };
}
type Module = ModuleDefs[keyof ModuleDefs];
type ModuleType = Module['type'];

type ModuleFunc<T extends ModuleType> = (input: SignalInstance, module: ModuleDefs[T]) => SignalInstance[];

type Processors = { [T in ModuleType]: ModuleFunc<T>; }
const processers: Processors = {
    'b': (_, module) => {
        const { id, outputs } = module;
        return outputs.map(to => ({ from: id, to, signal: 'low' }));
    },
    'f': ({ signal }, module: ModuleDefs['f']) => {
        if (signal === 'high') return [];
        module.value = flip(module.value);
        const { id: from, value } = module;
        return module.outputs.map(to => ({ from, to, signal: value }));
    },
    'c': ({ signal, from }, { id, inputs, outputs }) => {
        inputs.set(from, signal);
        const allHigh = iter(inputs.values()).every(v => v === 'high');
        const value = allHigh ? 'low' : 'high';
        return outputs.map(to => ({ from: id, to, signal: value }));
    }
}


const parseModule = (line: string): Module => {
    const [idStr, outputString] = line.split(' -> ');
    const outputs = outputString.split(', ');

    if (idStr === 'broadcaster') {
        return { type: 'b', id: idStr, outputs };
    }
    else {
        const [type, ...rest] = idStr;
        const id = rest.join('');
        if (type === '%') {
            return { type: 'f', id, value: 'low', outputs };
        }
        else {
            const inputs = new Map<string, Signal>();
            return { type: 'c', id, inputs, outputs };
        }
    }
}

const isConjunction = (module: Module): module is ModuleDefs['c'] => module.type === 'c';
const isFlipFlop = (module: Module): module is ModuleDefs['f'] => module.type === 'f';

/**
 * By default we won't know all inputs of a conjunction in order to check if all outputs are high. 
 * So we need to wire up the conjunctions to the modules that output to them.
 * @param modules 
 */
const wireUpConjunctions = (modules: Map<string, Module>) => {
    const conjunctions = new Map(iter(modules.values()).filter(isConjunction).map(m => [m.id, m] as const));
    for (const module of modules.values()) {
        for (const output of module.outputs) {
            const conjunction = conjunctions.get(output);
            if (conjunction) {
                conjunction.inputs.set(module.id, 'low');
            }
        }
    }
}

const modules = new Map(lines.map(parseModule).map(m => [m.id, m]));
wireUpConjunctions(modules);

const pushButton = () => {
    const queue: SignalInstance[] = [{ from: 'button', to: 'broadcaster', signal: 'low' }];
    while (queue.length) {
        const signal = queue.shift()!;
        const module = modules.get(signal.to);
        if (!module) {
            // "for testing purposes" :|
            continue;
        }
        const newSignals = processers[module.type](signal, module as any);
        queue.push(...newSignals);
    }
}

const nodesPointingTo = (id: string): string[] => {
    return iter(modules.values()).filter(x => x.outputs.includes(id)).map(x => x.id).array();
}

/**
 * Looking at a graph of the nodes in graphviz leads to the conclusion
 * that there are 4 separate cycles that combine to RX eventually.
 * I reason that if I can find the cycle lengths of each of those 4 cycles
 * then I can use LCM to find the length of the full cycle.
 * @param node 
 */
const findFlipFlopsLeadingTo = (id: string): string[] => {
    const nodes = nodesPointingTo(id);
    if (nodes.length > 1)
        return nodes;
    if (nodes.length == 0)
        throw new Error(`No nodes found for ${id}`);
    return findFlipFlopsLeadingTo(nodes[0]);
}


const dependencies = (id: string): string[] => {
    const visited = new Set<string>();
    const queue = [id];
    while (queue.length) {
        const node = queue.shift()!;
        if (visited.has(node)) continue;
        visited.add(node);
        const deps = nodesPointingTo(node);
        queue.push(...deps);
    }
    return iter(visited.keys()).array();
}

const networkState = (modules: Map<string, Module>, rootFlipFlop: string, dependencies: string[]) => {
    return rootFlipFlop + ':::' + iter(modules.values())
        .filter(isFlipFlop)
        .filter(f => dependencies.includes(f.id))
        .sort((a, b) => a.id.localeCompare(b.id))
        .map(f => `${f.id}:${f.value}`)
        .join('::');
}


const ffs = findFlipFlopsLeadingTo('rx');
console.log(ffs);

const deps = ffs.map(f => [f, dependencies(f).map(x => modules.get(x)).filter(notEmpty).filter(isFlipFlop).map(x => x.id)] as const);
console.log(deps);

const getStates = (modules: Map<string, Module>) => {
    return ffs.map(f => networkState(modules, f, deps.find(([id]) => id === f)![1]));
}

const stateMap = new Map<string, string>();

const found: Record<any, boolean> = {};

const countCycle = (node: string) => {
    const keys = iter(stateMap.keys())
    const mapped = keys.map(x => x.split(':::')[0]).array();
    const filtered = mapped.filter(x => x === node);
    return filtered.length;
}

while (true) {
    const states = getStates(modules);
    for (const state of states) {
        const [ff] = state.split(':::');
        if (!found[ff] && stateMap.has(state)) {
            found[ff] = true;
            console.log(`found cycle for ${ff}`);
        }
    }

    if(Object.values(found).length == ffs.length) {
        console.log('all cycles found');
        break;
    }

    pushButton();

    const afterStates = getStates(modules);
    for(let i = 0; i < ffs.length; i++) {
        if(!stateMap.has(states[i])) {
            stateMap.set(states[i], afterStates[i]);
        }
    }
}

const cycleLengths = ffs.map(countCycle);
console.log(cycleLengths);

const lcm = (a: number, b: number) => {
    return (a * b) / gcd(a, b);
}

const gcd = (a: number, b: number): number => {
    if (b === 0) return a;
    return gcd(b, a % b);
}

const cycleLength = cycleLengths.reduce(lcm);
console.log(cycleLength);