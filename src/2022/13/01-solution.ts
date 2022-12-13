//https://adventofcode.com/2022/day/13
import { add, readFile } from "../../utils";
const text = readFile(`${__dirname}\\01-input.txt`);

type ListItem = number | ListItem[];
type List = ListItem[];
type Outcome = 'right' | 'wrong' | 'unknown';

const rawPairs = text.split(/\r\n\r\n/im);
const pairs: List[] = rawPairs.map(x => x.split(/\r\n/i).map(x => JSON.parse(x)));

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

const s = pairs.map((pair, i) => ({ pair, valid: validate(pair[0], pair[1]), i: i + 1 }))
    .filter(x => x.valid == 'right')
    .map(x => x.i)
    .reduce(add);
console.log(s);