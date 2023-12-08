
import { readLines, notEmpty, sortNumber, binarySearch } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty).map(Number);

const isValid = (index: number, numbers: number[]) => {
    const val = numbers[index];
    const previous = numbers.slice(index - 25, index).sort(sortNumber);
    for(let j = 0; j < index; j++) {
        const a = previous[j];
        const d = val - a;
        const found = binarySearch(previous, d, sortNumber, j + 1);
        if(found != -1)
            return true;
    }
    return false;
}

const preambleLength = 25;

const findFirstInvalid = (numbers: number[]) => {
    for(let i = preambleLength; i < lines.length; i++) {
        if(!isValid(i, lines)) {
            return lines[i];
        }
    }
}

const target = findFirstInvalid(lines)!;

let low = 0;
let high = 0;
let sum = lines[0];

while(sum != target) {
    if(sum < target) {
        high++;
        sum += lines[high];
    }
    else {
        sum -= lines[low];
        low++;
    }
}

const range = lines.slice(low, high + 1);
const min = Math.min(...range);
const max = Math.max(...range);
const weakness = min + max;
console.log(weakness);
