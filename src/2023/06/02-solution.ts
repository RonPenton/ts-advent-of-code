// https://adventofcode.com/2023/day/6

import { readLines, notEmpty, iterateRegex, mul } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).map(x => x.replaceAll(' ', ''));

const durations = [...iterateRegex(/\d+/g, lines[0])].map(Number);
const distances = [...iterateRegex(/\d+/g, lines[1])].map(Number);

type Race = { duration: number, distance: number }

const races = durations.map((duration, i) => ({ duration, distance: distances[i] }));

const computeWinningStrategies = (race: Race) => {
    const { duration, distance } = race;
    const results = [];
    const center = duration / 2;

    for (let time = center; time < duration; time++) {
        const d = computeTime(time, duration);
        if (d > distance) results.push(d);
        else break;
    }
    for (let time = center - 1; time >= 0; time--) {
        const d = computeTime(time, duration);
        if (d > distance) results.push(d);
        else break;
    }

    return results;
}

const computeTime = (time: number, duration: number) => {
    return time * (duration - time);
}


const winningCombinations = races.map(computeWinningStrategies);
const result = winningCombinations.map(x => x.length).reduce(mul, 1);
console.log(result);
