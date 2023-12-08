
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

for(let i = preambleLength; i < lines.length; i++) {
    if(!isValid(i, lines)) {
        console.log(lines[i]);
        process.exit();
    }
}
    