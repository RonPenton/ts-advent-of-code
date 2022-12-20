//https://adventofcode.com/2022/day/19
import { debug, defined, entries, fromEntries, full, keysOf, Pair, pairs, range, readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const reg = /Each (\w+) robot costs (\d+) (\w+)(?: and (\d+) (\w+))?./gi

const materials = ['geode', 'obsidian', 'clay', 'ore'] as const;
type Material = typeof materials[number];

type Quantity = Partial<Record<Material, number>>;
type FullQuantity = Record<Material, number>;
type RobitEntry = [Material, Quantity];
type BluePrint = Record<Material, Quantity>;

type Factory = {
    readonly blueprint: BluePrint;
    robits: FullQuantity;
    materials: FullQuantity;
}

export const empty = () => Object.fromEntries(materials.map(m => [m, 0])) as FullQuantity;
export const quantity = (entries: [Material, number][]): FullQuantity => {
    return { ...empty(), ...Object.fromEntries(entries) as Quantity }
}

const parse = (s: string) => [...s.matchAll(reg)];
const formatCost = ([amt, mat]: Pair<string>): [Material, number] => [mat as Material, parseInt(amt)];
const formatCosts = (costs: string[]) => fromEntries(pairs(costs).map(formatCost));
const formatRobit = ([_, mat, ...costs]: string[]): RobitEntry => [mat as Material, formatCosts(costs.filter(defined))];
const format = (robits: RegExpMatchArray[]) => fromEntries(robits.map(formatRobit)) as BluePrint;
const factory = (blueprint: BluePrint): Factory => ({ blueprint, robits: quantity([['ore', 1]]), materials: empty() })

const factories = lines.map(parse).map(format).filter(x => full(materials, x)).map(factory);

const add = (a: FullQuantity, b: Quantity): FullQuantity => {
    const c = { ...a };
    keysOf(b).forEach(k => c[k] += b[k]!);
    return c;
}
const sub = (a: FullQuantity, b: Quantity): FullQuantity => {
    const c = { ...a };
    keysOf(b).forEach(k => c[k] -= b[k]!);
    return c;
}
const mul = (a: FullQuantity, b: number): FullQuantity => {
    const c = { ...a };
    keysOf(a).forEach(k => c[k] *= b);
    return c;
}

const timeTilBuild = (mat: Material, f: Factory): number | undefined => {
    const req = entries(f.blueprint[mat]);
    if (req.some(([b]) => f.robits[b] == 0)) return undefined;
    const needs = req.map(([b, q]) => [b, q - f.materials[b]] as const).filter(([b, n]) => n > 0);
    if (needs.length == 0) return 0;
    const rated = needs.map(([b, n]) => Math.ceil(n / f.robits[b]));
    return Math.max(...rated);
}

type BuildOrder = {
    factory: Factory,
    builds: Material[],
    geodes: number
};

const runFactory = (factory: Factory, i: number) => {

    let max = 0;
    console.log(`Factory: ${i}`);

    const maxOre = Math.max(...materials.map(m => factory.blueprint[m].ore ?? 0));
    const maxClay = Math.max(...materials.map(m => factory.blueprint[m].clay ?? 0));

    const nextBuild = ({ factory, builds, geodes }: BuildOrder, left: number): number => {

        //debug(`left: ${left}, builds: ${builds}`);

        if (left <= 0) {
            return geodes;
        }

        // heuristic... in a theoretical world if we could build a geode miner
        // every turn until the end and it's still less than the number of 
        // geodes another path found, abandon this path. It's no good. 
        if (geodes + (left * (left + 1)) / 2 < max) {
            return geodes;
        }
        if (geodes > max)
            max = geodes;

        let potentials = materials
            .map(m => [m, timeTilBuild(m, factory)] as const)
            .filter(([_, q]) => q !== undefined && q < left);

        // don't build clay or ore robots if we already have enough to pump every
        // robot out in a cycle.
        if (factory.robits.ore >= maxOre) {
            potentials = potentials.filter(([m]) => m != 'ore');
        }
        if (factory.robits.clay >= maxClay) {
            potentials = potentials.filter(([m]) => m != 'clay');
        }

        // greedy optimization; if we can build a geode miner always build a geode miner. 
        // limits search space. 
        if (potentials.some(([m, q]) => m == 'geode' && q == 0)) {
            potentials = potentials.filter(([m]) => m == 'geode');
        }

        const localMaxes = potentials.flatMap(([m, q]) => {
            const time = q! + 1;
            const materials = sub(add(factory.materials, mul(factory.robits, time)), factory.blueprint[m]);
            const robits = add(factory.robits, quantity([[m, 1]]));
            return nextBuild({
                factory: { ...factory, materials, robits },
                builds: [...builds, m],
                geodes: m == 'geode' ? geodes + (left - time) : geodes
            }, left - time);
        });

        if (localMaxes.length == 0) return geodes;

        return Math.max(...localMaxes);
    }

    return nextBuild({ factory, builds: [], geodes: 0 }, 32);
}

const maxes = factories.slice(0, 3).map(runFactory);
const quality = maxes.reduce((acc, max, i) => acc * max, 1);

console.log(quality);
