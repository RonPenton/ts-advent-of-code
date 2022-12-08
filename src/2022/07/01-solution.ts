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

const cd = (stack: Dir[], param: string): Dir[] => {
    const [head, ...tail] = stack;
    if (param == '/')
        return [stack.at(-1)!];
    if (param == '..')
        return tail;
    const sub = findDir(head, param);
    return [sub, ...stack];
}

const dir = (stack: Dir[], param: string): Dir[] => {
    const [head] = stack;
    findDir(head, param);
    return stack;
}

const file = (stack: Dir[], file: string, size: number) => {
    const [head] = stack;
    findFile(head, file, size);
    return stack;
}

const processLine = (line: string, stack: Dir[]) => {

    const { lineType, resp } = lineTypes
        .map(lineType => ({ lineType, resp: lineRegs[lineType].exec(line) }))
        .filter(x => x.resp)[0];

    if (!resp) { throw new Error('unrecognized input') }
    const [_, p1, p2] = resp;

    switch (lineType) {
        case 'ls': return stack;
        case 'cd': return cd(stack, p1);
        case 'dir': return dir(stack, p1);
        case 'file': return file(stack, p2, parseInt(p1));
    }
}

const size = (dir: Dir): number => {
    return dir.dirs.map(size).reduce(add, 0) + dir.files.map(x => x.size).reduce(add, 0);
}

const bfs = (dir: Dir): Dir[] => {
    return [dir, ...dir.dirs.flatMap(bfs)]
}

const root: Dir = { name: '/', files: [], dirs: [] };

commands.reduce((stack, line) => processLine(line, stack), [root]);

const sizes = bfs(root).map(size).filter(s => s < 100000);
const answer = sizes.reduce(add, 0);
console.log(answer);
