//https://adventofcode.com/2022/day/2
import { readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const plays = ['rock', 'paper', 'scissors'] as const;
const outcomes = ['win', 'lose', 'draw'] as const;
const inputMap: Record<string, Play> = {
    'A': 'rock',
    'B': 'paper',
    'C': 'scissors',
    'X': 'rock',
    'Y': 'paper',
    'Z': 'scissors'
};

type Play = typeof plays[number];
type Round = [Play, Play];
type Outcome = typeof outcomes[number];

const playScore: Record<Play, number> = { rock: 1, paper: 2, scissors: 3 };
const outcomeScore: Record<Outcome, number> = { win: 6, lose: 0, draw: 3 };

const comp = (val: -1 | 0 | 1) => ([a, b]: Round) => plays[(plays.indexOf(a) + val + 3) % 3] === b;
const outcomeMap: Record<Outcome, ReturnType<typeof comp>> = {
    win: comp(-1),
    lose: comp(1),
    draw: comp(0)
}

const outcome = ([a, b]: Round): Outcome => outcomes.find(o => outcomeMap[o]([b, a]))!;

const score = (play: Play, outcome: Outcome) => playScore[play] + outcomeScore[outcome];

const parse = (str: string) => str.split(' ').map(x => inputMap[x]) as Round;

const result = lines.map(parse).reduce((s, [theirs, yours]) => s + score(yours, outcome([theirs, yours])), 0);
console.log(result);
