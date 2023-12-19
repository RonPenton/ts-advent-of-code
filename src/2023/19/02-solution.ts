// https://adventofcode.com/2023/day/19

import { cloneDeep } from "lodash";
import { readLines, iterateRegex, add, Range, rangeIntersection } from "../../utils";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`);

const xmas = ['x', 'm', 'a', 's'] as const;
type ID = typeof xmas[number];
type Op = '<' | '>';

type Condition = { id: ID, op: Op, value: number, dest: string };
type Rule = { name: string, conditions: Condition[], end: string };
type AcceptiblePart = Record<ID, Range>;

const parseRule = (line: string): Rule => {
    const [name, rest] = line.substring(0, line.length - 1).split('{')
    const reg = /(\w)([<>])(\d+):(\w+)/gi;
    const conditions = [...iterateRegex(reg, rest)]
        .map(([_, id, op, value, dest]) => ({ id: id as ID, op: op as Op, value: parseInt(value), dest }));
    const end = iter(rest.split(',')).last()!;
    return { name, conditions, end };
}

const parseInput = (lines: string[]) => {
    let i = 0;
    let rules: Rule[] = [];
    for (; i < lines.length; i++) {
        if (lines[i].trim().length == 0)
            break;
        rules.push(parseRule(lines[i]));
    }
    return rules;
}

const rules = parseInput(lines);

const workflows = new Map<string, Rule>(rules.map(r => [r.name, r]));

const MIN = 1;
const MAX = 4000;

const traceWorkflow = (name: string, part: AcceptiblePart): AcceptiblePart[] => {

    if (name == 'A')
        return [part];
    if (name == 'R')
        return [];

    let p: AcceptiblePart | null = cloneDeep(part);
    const parts: AcceptiblePart[] = [];
    const { conditions, end } = workflows.get(name)!;
    for (const c of conditions) {
        if (p === null) break;
        const [accepted, rejected] = bifurcatePartRange(p, c);
        if (accepted) {
            parts.push(...traceWorkflow(c.dest, accepted));
        }
        p = rejected;
    }
    if (p !== null) {
        parts.push(...traceWorkflow(end, p));
    }
    return parts;
}

const bifurcatePartRange = (part: AcceptiblePart, condition: Condition): [AcceptiblePart | null, AcceptiblePart | null] => {
    const { id, op, value } = condition;
    if (op == '<') {
        const acceptedRange: Range = [MIN, value - 1];
        const rejectedRange: Range = [value, MAX];
        return [constrainRange(part, id, acceptedRange), constrainRange(part, id, rejectedRange)];
    }
    else {
        const acceptedRange: Range = [value + 1, MAX];
        const rejectedRange: Range = [MIN, value];
        return [constrainRange(part, id, acceptedRange), constrainRange(part, id, rejectedRange)];
    }
}

const constrainRange = (part: AcceptiblePart, id: ID, range: Range): AcceptiblePart | null => {
    const p = cloneDeep(part);
    const r = rangeIntersection(p[id], range);
    if (r === undefined) return null;
    p[id] = r;
    return p;
}

const possibilities = (part: AcceptiblePart): number => {
    const { x, m, a, s } = part;
    return (x[1] - x[0] + 1) * (m[1] - m[0] + 1) * (a[1] - a[0] + 1) * (s[1] - s[0] + 1);
}

const ranges =
    traceWorkflow('in', { x: [MIN, MAX], m: [MIN, MAX], a: [MIN, MAX], s: [MIN, MAX] })
        .map(possibilities)
        .reduce(add);

console.log(ranges);
