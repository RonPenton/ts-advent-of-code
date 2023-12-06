
import { readLines, notEmpty, iterateRegex, add } from "../../utils";

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

const countBags = (bag: string): number => {
    const policy = map.get(bag);
    if (!policy) return 0;
    if(policy.contains.length === 0) return 0;
    return policy.contains.map(c => c.count + c.count * countBags(c.color)).reduce(add, 0);
}

const solution = countBags('shiny gold');

console.log(JSON.stringify(solution));
