
import { difference, range, readLines, sortNumberRev } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const computeSeat = (line: string) => {
    const row = parseInt(line.slice(0, 7).replace(/F/g, '0').replace(/B/g, '1'), 2);
    const col = parseInt(line.slice(7).replace(/L/g, '0').replace(/R/g, '1'), 2);
    return row * 8 + col;
}

const ids = lines.map(computeSeat).sort(sortNumberRev);

const theoretical = new Set(range(ids[0]));
const missing = difference(theoretical, ids);

console.log(missing);
