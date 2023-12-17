
import { readLines, notEmpty } from "../../utils";
import { Coord, OrthogonalDirection, moveCoord, rectilinear, rotate } from "../../utils/grid";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

type Ordinal = 'N' | 'S' | 'E' | 'W' | 'L' | 'R' | 'F';
type Direction = OrthogonalDirection | 'L' | 'R' | 'F';

const ordinalToDirection = (ordinal: Ordinal): Direction => {
    switch (ordinal) {
        case 'N': return 'up';
        case 'S': return 'down';
        case 'E': return 'right';
        case 'W': return 'left';
    }
    return ordinal;
}

type Instruction = {
    direction: Direction;
    value: number;
}

const parseInstruction = (line: string): Instruction => {
    const direction = ordinalToDirection(line[0] as Ordinal);
    const value = parseInt(line.slice(1), 10);
    return { direction, value };
}

let currentDirection: OrthogonalDirection = 'right';
let currentPosition: Coord = [0, 0];

const instructions = lines.map(parseInstruction);
for (const { direction, value } of instructions) {
    switch (direction) {
        case 'L':
            currentDirection = rotate(currentDirection, -value as any) as OrthogonalDirection;
            break;
        case 'R':
            currentDirection = rotate(currentDirection, value as any) as OrthogonalDirection;
            break;
        case 'F':
            currentPosition = moveCoord(currentPosition, currentDirection, value);
            break;
        default:
            currentPosition = moveCoord(currentPosition, direction, value);
            break;
    }
}

const distance = rectilinear([0, 0], currentPosition);
console.log(distance);
