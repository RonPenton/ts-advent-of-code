
import { readLines, notEmpty, sortNumber } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty).map(Number);

const sorted = lines.sort(sortNumber);
sorted.push(sorted[sorted.length - 1] + 3);

const map = new Map<number, number>();
map.set(0, 1);

for(const a of sorted) {
    const b = map.get(a - 1) ?? 0;
    const c = map.get(a - 2) ?? 0;
    const d = map.get(a - 3) ?? 0;
    map.set(a, b + c + d);
}

const result = map.get(sorted[sorted.length - 1]) ?? 0;
console.log(result);