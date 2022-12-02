import { readFile, readLines } from "../../utils";
const text = readFile(`${__dirname}\\01-input.txt`);

const [input, ...rawGroups] = text.split(/(?:\r?\n){2}/i)

type BoardDefinition = number[][];
type BoardState = boolean[][];
type Board = {
    board: BoardDefinition,
    state: BoardState
}

const cloneLine = (line: boolean[]) => [...line];
const cloneState = (state: BoardState) => state.map(cloneLine);
const parse = (str: string) => parseInt(str.trim());
const notEmpty = (str: string) => str !== '';
const boards = rawGroups.map(x => x.split(/\r?\n/i).map(y => y.split(/\s+/i).filter(notEmpty).map(parse)));

const indices = [...Array(5).keys()];
const identity = <T>(t: T) => t;
const checkH = (row: number) => (state: BoardState) => state[row].every(identity);
const checkV = (col: number) => (state: BoardState) => indices.every(x => state[x][col]);
const thatsABingo = ({ state }: Board) =>
    indices.reduce((b, r) => b || checkH(r)(state), false)
    || indices.reduce((b, c) => b || checkV(c)(state), false)

const clean = indices.map(_ => indices.map(_ => false));
const states = boards.map(board => ({ board, state: cloneState(clean) }));

type IterFunc<T> = (r: number, c: number, val: T) => void;
const iter = <T>(board: T[][], func: IterFunc<T>) => {
    indices.forEach(r => indices.forEach(c => func(r, c, board[r][c])));
}

const plays = input.split(/,/i).map(x => parseInt(x));
const play = ({ board, state }: Board, input: number): Board => {
    const clone = cloneState(state);
    iter(board, (r, c, v) => (v == input) && (clone[r][c] = true));
    return { board, state: clone };
}

const round = (states: Board[], [val, ...rest]: number[]) => {

    states = states.map(x => play(x, val));
    if (states.length == 1) {
        const [lose] = states;
        if (thatsABingo(lose)) {
            let acc = 0;
            iter(lose.state, (r, c, v) => !v && (acc += lose.board[r][c]));
            console.log(acc * val);
            return;
        }
    }
    else {
        states = states.filter(x => !thatsABingo(x));
    }

    round(states, rest);
}

round(states, plays);
