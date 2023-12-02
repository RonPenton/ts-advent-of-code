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

const power = (pick: Pick): number => {
    return colors.reduce((acc, color) => acc * pick[color], 1);
}

const games = lines.map(parseLine);
const maxes = games.map(max);
const powers = maxes.map(x => x.pick).map(power);
const sum = powers.reduce(add, 0);

console.log(sum);