// https://adventofcode.com/2025/day/5

import { add, readFile } from "../../utils";
import { Range, rangeContains, rangesUnion } from "../../utils/range";


const file = readFile(`${__dirname}\\input.txt`);

const [rangeStr, idsStr] = file.split(/(?:\r?\n){2}/i);

const parseRange = (s: string): Range => s.split('-').map(Number) as unknown as Range;
const parseId = (s: string): number => Number(s.trim());
const ranges = rangeStr.split(/\r?\n/).map(parseRange);
const ids = idsStr.split(/\r?\n/).map(parseId);

const optimizedRanges = rangesUnion(ranges);

const countValidIngredients = ([a, b]: Range) => b - a + 1;

const validIngredients = optimizedRanges.map(countValidIngredients).reduce(add);
console.log(`Valid ingredients: ${validIngredients}`);