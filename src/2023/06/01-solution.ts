// https://adventofcode.com/2023/day/6

import { readLines, notEmpty, iterateRegex, mul } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const durations = [...iterateRegex(/\d+/g, lines[0])].map(Number);
const distances = [...iterateRegex(/\d+/g, lines[1])].map(Number);

type Race = { duration: number, distance: number }

const races = durations.map((duration, i) => ({ duration, distance: distances[i] }));

const computeWinningStrategies = (race: Race) => {
    const { duration, distance } = race;
    const results = [];
    for(let time = 0; time < duration; time++) {
        const distanceTraveled = time * (duration - time);
        results.push(distanceTraveled);
    }
    return results.filter(x => x > distance);
}

const winningCombinations = races.map(computeWinningStrategies);
const result = winningCombinations.map(x => x.length).reduce(mul, 1);
console.log(result);
