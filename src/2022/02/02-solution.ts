import { readLines } from "../../utils";
const lines = readLines(`${__dirname}\\01-input.txt`);

const plays = ['rock', 'paper', 'scissors'] as const;
const outcomes = ['win', 'lose', 'draw'] as const;
const playMap: Record<string, Play> = {
    'A': 'rock',
    'B': 'paper',
    'C': 'scissors'
};
const outcomeMap: Record<string, Outcome> = {
    'X': 'lose',
    'Y': 'draw',
    'Z': 'win'
}

type Play = typeof plays[number];
type Round = [Play, Outcome];
type Outcome = typeof outcomes[number];

const playScore: Record<Play, number> = { rock: 1, paper: 2, scissors: 3 };
const outcomeScore: Record<Outcome, number> = { win: 6, lose: 0, draw: 3 };

const comp = (val: -1 | 0 | 1) => ([a, b]: [Play, Play]) => plays[(plays.indexOf(a) + val + 3) % 3] === b;
const outcomeCalc: Record<Outcome, ReturnType<typeof comp>> = {
    win: comp(-1),
    lose: comp(1),
    draw: comp(0)
}

const play = ([a, outcome]: Round): Play => plays.find(x => outcomeCalc[outcome]([x, a]))!;

const score = (play: Play, outcome: Outcome) => playScore[play] + outcomeScore[outcome];

const split = (str: string) => str.split(' ');
const parse = ([play, outcome]: string[]) => [playMap[play], outcomeMap[outcome]] as const;

const result = lines.map(split).map(parse).reduce((s, [theirs, outcome]) => s + score(play([theirs, outcome]), outcome), 0);
console.log(result);
