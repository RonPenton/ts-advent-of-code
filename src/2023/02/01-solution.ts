// https://adventofcode.com/2023/day/2

import { add, notEmpty, readLines } from "../../utils";
import { mapToRecord } from "../../utils/record";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const colors = ['red', 'green', 'blue'] as const;
type Color = typeof colors[number];
type Pick = Record<Color, number>;
type Game = { id: number, picks: Pick[]; }
type GameMax = { id: number, pick: Pick };

const regexs = mapToRecord(colors, color => new RegExp(`(\\d+) ${color}`, 'i'));

const parsePick = (segment: string): Pick => {
    return mapToRecord(colors, color => {
        const match = segment.match(regexs[color]);
        return match ? parseInt(match[1]) : 0;
    });
}

const parseLine = (line: string): Game => {
    const [gameId, unparsedPicks] = line.split(':');
    const id = parseInt(gameId.substring(5));
    const picks = unparsedPicks.split(';').map(parsePick);
    return { id, picks };
}

const max = (game: Game): GameMax => {
    const pick = game.picks.reduce((max, pick) => {
        return mapToRecord(colors, color => Math.max(max[color], pick[color]));
    }, mapToRecord(colors, color => 0));
    return { id: game.id, pick };
}

const test = (thresholds: Pick) => (game: GameMax): boolean => {
    return colors.every(color => game.pick[color] <= thresholds[color]);
}

const thresholds: Pick = {
    red: 12,
    green: 13,
    blue: 14
}

const games = lines.map(parseLine);
const maxes = games.map(max);
const tester = test(thresholds);
const filtered = maxes.filter(tester);
const sum = filtered.map(x => x.id).reduce(add, 0);

console.log(sum);