import { addC, fparseInt, mult, range, readFile, } from "../../utils";
const file = readFile(`${__dirname}\\01-input.txt`);

type Crates = string[][];

type Move = { count: number, from: number, to: number };
const moveCrate = (crates: Crates) => ({ from, to, count }: Move) => {
    range(count).map(_ => crates[from].pop()!).reverse().forEach(c => crates[to].push(c));
}
const populateCrateRow = (crates: Crates) => (row: string[]) => row.forEach((c, i) => c != ' ' && crates[i].push(c));

const crates: Crates = range(9).map(x => []);
const [crateDefs, instructionDefs] = file.split(/(?:\r?\n){2}/i);
const [_, ...crateContents] = crateDefs.split(/\r\n/i).reverse();

const crateIndices = range(9).map(mult(4)).map(addC(1));
const crateRows = crateContents.map(x => crateIndices.map(i => x[i]));
crateRows.forEach(populateCrateRow(crates));

const insreg = /(\d+).*(\d+).*(\d+)/i;
const splitInstruction = (s: string) => parseInstruction(insreg.exec(s)!.map(fparseInt));
const parseInstruction = ([_, count, f, t]: number[]) => ({ count, from: f - 1, to: t - 1 });

const instructionStrings = instructionDefs.split(/\r\n/i);
const instructions = instructionStrings.map(splitInstruction);

instructions.forEach(moveCrate(crates));
const answer = crates.map(x => x.at(-1)).join('');

console.log(answer);
