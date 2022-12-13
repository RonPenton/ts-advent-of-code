//https://adventofcode.com/2022/day/13
import { readFile } from "../../utils";
const text = readFile(`${__dirname}\\01-input.txt`);

type ListItem = number | ListItem[];
type List = ListItem[];
type Outcome = 'right' | 'wrong' | 'unknown';

const lines: List[] = text.split(/(?:\r\n){1,2}/im).map(x => JSON.parse(x)).concat([[[2]], [[6]]]);

const validateList = (a: ListItem[], b: ListItem[]): Outcome => {
    if (b.length == 0 && a.length > 0) return 'wrong';
    if (a.length == 0 && b.length > 0) return 'right';
    if (a.length == 0 && b.length == 0) return 'unknown';
    const [ha, ...resta] = a;
    const [hb, ...restb] = b;

    const o = validate(ha, hb);
    if (o == 'wrong' || o == 'right') return o;
    return validateList(resta, restb);
}

const validate = (a: ListItem, b: ListItem): Outcome => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a == b ? 'unknown' : a < b ? 'right' : 'wrong';
    }
    return validateList([a].flat(), [b].flat());
}

const sorter = (a: ListItem, b: ListItem): number => {
    const r = validate(a, b);
    return r == 'right' ? -1 : r == 'unknown' ? 0 : 1;
}

lines.sort(sorter);

const find = (search: number, depth: number) => (x: ListItem): boolean => {
    if (typeof x === 'number' && depth == 0 && x == search)
        return true;
    if (depth < 0 || typeof x === 'number' || x === undefined)
        return false;
    return find(search, depth - 1)(x[0]);
}

const a = lines.findIndex(find(2, 2)) + 1;
const b = lines.findIndex(find(6, 2)) + 1;
console.log(a * b);