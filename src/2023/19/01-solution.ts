// https://adventofcode.com/2023/day/19

import { readLines, notEmpty, iterateRegex, add } from "../../utils";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`);

type ID = 'x' | 'm' | 'a' | 's';
type Op = '<' | '>';

type Condition = { id: ID, op: Op, value: number, dest: string };
type Rule = { name: string, conditions: Condition[], end: string };
type Part = Record<ID, number>;

const parseRule = (line: string): Rule => {
    const [name, rest] = line.substring(0, line.length - 1).split('{')
    const reg = /(\w)([<>])(\d+):(\w+)/gi;
    const conditions = [...iterateRegex(reg, rest)]
        .map(([_, id, op, value, dest]) => ({ id: id as ID, op: op as Op, value: parseInt(value), dest }));
    const end = iter(rest.split(',')).last()!;
    return { name, conditions, end };

}

const parsePart = (line: string): Part => {
    const reg = /([xmas])=(\d+)/gi;
    const props = [...iterateRegex(reg, line)].map(([_, id, value]) => [id as ID, parseInt(value)] as const);
    return Object.fromEntries(props) as Part;
}

const parseInput = (lines: string[]) => {
    let i = 0;
    let rules: Rule[] = [];
    for (; i < lines.length; i++) {
        if (lines[i].trim().length == 0)
            break;
        rules.push(parseRule(lines[i]));
    }
    i++;
    let parts: Part[] = [];
    for (; i < lines.length; i++) {
        parts.push(parsePart(lines[i]));
    }

    return { rules, parts };
}

const processPart = (part: Part, rule: Rule): string => {
    const { conditions, end } = rule;
    for (const { id, op, value, dest } of conditions) {
        if (op == '<' && part[id] < value)
            return dest;
        if (op == '>' && part[id] > value)
            return dest;
    }
    return end;
}

const { rules, parts } = parseInput(lines);

const workflows = new Map<string, Rule>(rules.map(r => [r.name, r]));
const partsBin = new Map<string, Part[]>();

// every part goes to 'in' first.
partsBin.set('in', parts);

const addToBin = (part: Part, name: string) => {
    const bin = partsBin.get(name) ?? [];
    bin.push(part);
    partsBin.set(name, bin);
}

const processParts = (): boolean => {
    let notDone = false;
    for (const [wf, bin] of partsBin.entries()) {
        if(wf == 'R' || wf == 'A') continue;
        partsBin.delete(wf);
        for (const part of bin) {
            const next = processPart(part, workflows.get(wf)!);
            if (next != 'R' && next != 'A') notDone = true;
            addToBin(part, next);
        }

    }
    return notDone;
}

while(processParts()) {}

const scorePart = (part: Part) => {
    return Object.entries(part).map(([id, value]) => value).reduce(add);
}

const score = iter(partsBin.get('A')!).map(scorePart).reduce(add, 0);
console.log(score);

