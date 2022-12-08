//https://adventofcode.com/2022/day/7
import { add, readLines } from "../../utils";
const commands = readLines(`${__dirname}\\01-input.txt`);

type File = { name: string, size: number }
type Dir = { name: string; files: File[], dirs: Dir[] }

const lineTypes = ['cd', 'ls', 'file', 'dir'] as const;
type LineType = typeof lineTypes[number];

const lineRegs: Record<LineType, RegExp> = {
    file: /(\d+) (.+)/i,
    dir: /dir (.+)/i,
    ls: /\$ ls/i,
    cd: /\$ cd (.+)/i
};

const findDir = (dir: Dir, name: string) => {
    let sub = dir.dirs.find(x => x.name == name);
    if (!sub) {
        sub = { name, files: [], dirs: [] };
        dir.dirs.push(sub);
    }
    return sub;
}

const findFile = (dir: Dir, name: string, size: number) => {
    let file = dir.files.find(x => x.name == name);
    if (!file) {
        file = { name, size };
        dir.files.push(file);
    }
    return file;
}

type State = { stack: Dir[], path: string[] };

const cd = ({ stack, path }: State, param: string): State => {
    const [head, ...tail] = stack;
    const [_, ...ptail] = param;
    if (param == '/')
        return { stack: [stack.at(-1)!], path: [param] }
    if (param == '..')
        return { stack: tail, path: ptail };
    const sub = findDir(head, param);
    return { stack: [sub, ...stack], path: [param, ...path] };
}

const dir = ({ stack, path }: State, param: string): State => {
    const [head] = stack;
    findDir(head, param);
    return { stack, path };
}

const file = ({ stack, path }: State, file: string, size: number) => {
    const [head] = stack;
    findFile(head, file, size);
    return { stack, path };
}

const processLine = (line: string, { stack, path }: State) => {

    const { lineType, resp } = lineTypes
        .map(lineType => ({ lineType, resp: lineRegs[lineType].exec(line) }))
        .filter(x => x.resp)[0];

    if (!resp) { throw new Error('unrecognized input') }
    const [_, p1, p2] = resp;

    switch (lineType) {
        case 'ls': return { stack, path };
        case 'cd': return cd({ stack, path }, p1);
        case 'dir': return dir({ stack, path }, p1);
        case 'file': return file({ stack, path }, p2, parseInt(p1));
    }
}

const size = (dir: Dir): number => {
    return dir.dirs.map(size).reduce(add, 0) + dir.files.map(x => x.size).reduce(add, 0);
}

const bfs = (dir: Dir): Dir[] => {
    return [dir, ...dir.dirs.flatMap(bfs)]
}

const root: Dir = { name: '/', files: [], dirs: [] };

commands.reduce((state, line) => processLine(line, state), { stack: [root], path: ['/'] });

const totalSize = size(root);
const totalFree = 70000000 - totalSize;
const totalNeeded = 30000000 - totalFree;

console.log({ totalSize, totalFree, totalNeeded });

const s = bfs(root).map(size).filter(x => x >= totalNeeded).sort((a, b) => a - b)[0];
console.log(s);
