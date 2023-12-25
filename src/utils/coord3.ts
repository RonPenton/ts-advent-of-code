export type Coord3 = [x: number, y: number, z: number];

export const parseCoord3 = (s: string): Coord3 => {
    const [x, y, z] = s.split(',').map(x => x.trim()).map(Number);
    return [x, y, z];
}

