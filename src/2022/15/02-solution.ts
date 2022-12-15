//https://adventofcode.com/2022/day/15
import { Coord, defined, fparseInt, range, readLines } from "../../utils";
import { eqCoord, iterateDiagonal, rectilinear } from "../../utils/grid";
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

const noBeaconForSensor = ({ location, dist }: Sensor, probe: Coord) => rectilinear(location, probe) <= dist;
const noBeacon = (sensors: Sensor[], probe: Coord) => sensors.some(s => noBeaconForSensor(s, probe));

const max = 4000000

const perimeter = ({ location: [r, c], dist }: Sensor): Coord[] => {
    dist = dist + 1;
    const left: Coord = [r, c - dist];
    const top: Coord = [r - dist, c];
    const right: Coord = [r, c + dist];
    const bottom: Coord = [r + dist, c];
    const points = [left, top, right, bottom, left];
    const path: Coord[] = [];
    const add = ([r, c]: Coord) => {
        if (r >= 0 && r <= max && c >= 0 && c <= max) {
            path.push([r, c]);
        }
    }
    range(4).forEach(i => iterateDiagonal(points[i], points[i + 1], add));
    return path;
}

const sensors = lines.map(split).map(parse).map(coords).map(sensor);
const points = sensors.map(perimeter).flat();
console.log(points.length);
const point = points.find(x => !noBeacon(sensors, x))!;
console.log(point);
console.log(point[1] * 4000000 + point[0]);
