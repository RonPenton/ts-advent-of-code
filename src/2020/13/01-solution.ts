
import { readLines, notEmpty } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);
const [a, b] = lines;

const time = Number(a);
const busses = b.split(',').filter(x => x !== 'x').map(Number);

let t = time;
while(true) {
    const bus = busses.find(x => t % x === 0);
    if(bus) {
        console.log(bus * (t - time));
        break;
    }
    t++;
}
