//https://adventofcode.com/2022/day/15
import { Coord, defined, fparseInt, range, readLines } from "../../utils";
import { eqCoord, rectilinear } from "../../utils/grid";
const lines = readLines(`${__dirname}\\01-input.txt`);

type Sensor = {
    location: Coord;
    beacon: Coord;
    dist: number;
}

const split = (s: string) => Array.from(s.matchAll(/(-?\d+)/ig)).map(x => x[0]);
const parse = (s: string[]) => s.filter(defined).map(fparseInt);
const coords = ([x1, y1, x2, y2]: number[]): Coord[] => [[y1, x1], [y2, x2]];
const sensor = ([location, beacon]: Coord[]): Sensor => ({ location, beacon, dist: rectilinear(location, beacon) });

const noSensor = ({ location, dist, beacon }: Sensor, probe: Coord) => rectilinear(location, probe) <= dist && !eqCoord(beacon, probe);
const potential = (sensors: Sensor[], probe: Coord) => !sensors.some(s => noSensor(s, probe));

const sensors = lines.map(split).map(parse).map(coords).map(sensor);

const vals = sensors.map(x => [x.beacon[1], x.location[1]]).flat();
const max = Math.max(...vals);
const min = Math.min(...vals);

const checkline = 2000000;

const answer = range(min - 1000000, max + 1000000).filter(probe => !potential(sensors, [checkline, probe]));
console.log(answer.length);

