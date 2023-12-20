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

const networkState = (modules: Map<string, Module>) => {
    return iter(modules.values())
        .filter(isFlipFlop)
        .sort((a, b) => a.id.localeCompare(b.id))
        .map(f => `${f.id}:${f.value}`)
        .join('::');
}

const modules = new Map(lines.map(parseModule).map(m => [m.id, m]));
wireUpConjunctions(modules);

const pushButton = () => {
    const pulses = {
        low: 1,         // one for the button push.
        high: 0
    };
    const queue: SignalInstance[] = [{ from: 'button', to: 'broadcaster', signal: 'low' }];
    while (queue.length) {
        const signal = queue.shift()!;
        const module = modules.get(signal.to);
        if(!module) {
            // "for testing purposes" :|
            continue;
        }
        const newSignals = processers[module.type](signal, module as any);
        queue.push(...newSignals);
        newSignals.forEach(s => pulses[s.signal]++);
    }
    return pulses;
}

const stateMap = new Map<string, { stateKey: string, low: number, high: number }>();

const startingState = networkState(modules);

const iterations = 1000;
// while(true) {
let signals = { low: 0, high: 0 };
for(let i = 0; i < iterations; i++) {
    // const currentState = networkState(modules);
    // if(stateMap.has(currentState)) {
    //     console.log('state found');
    //     break;
    // }

    const { low, high } = pushButton();
    signals.low += low;
    signals.high += high;
    // const stateKey = networkState(modules);
    // stateMap.set(currentState, { stateKey, low, high });

    //console.log({ low, high });
}

console.log(signals.low * signals.high);

// const iterations = 1000;
// const loopLength = stateMap.size;
// const totalLoops = Math.floor(iterations / loopLength);
// const remainder = iterations % loopLength;

// const signals = iter(stateMap.values()).reduce((acc, { low, high }) => ({ low: acc.low + low, high: acc.high + high }), { low: 0, high: 0 });
// signals.low *= totalLoops;
// signals.high *= totalLoops;

// let state = startingState;
// for(let i = 0; i < remainder; i++) {
//     const next = stateMap.get(state)!;
//     signals.low += next.low;
//     signals.high += next.high;
//     state = next.stateKey;
// }

// console.log(signals.low * signals.high);