
import { readLines, notEmpty, iterateRegex } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type ContainPolicy = {
    color: string;
    count: number;
}

type Policy = {
    color: string;
    contains: ContainPolicy[];
}

const parsePolicy = (line: string): Policy => {
    const [color, containsText] = line.split(" bags contain ");
    const containsPolicies = [...iterateRegex(/(\d+) (\w+ \w+) bags?/g, containsText)];
    const contains = containsPolicies.map(([_, count, color]) => ({ color, count: Number(count) }));
    return { color, contains };
}

const policies = lines.map(parsePolicy);

const map = new Map<string, Policy>(policies.map(p => [p.color, p]));

const containsBag = (start: string, target: string): boolean => {
    const policy = map.get(start);
    if (!policy) return false;
    if (policy.contains.some(c => c.color === target)) return true;
    return policy.contains.some(c => containsBag(c.color, target));
}

const solution = policies.filter(p => containsBag(p.color, "shiny gold")).length;

console.log(JSON.stringify(solution));
