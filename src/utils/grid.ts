export type Coord = [r: number, c: number];

export const OrthogonalDirections = ['up', 'down', 'left', 'right'] as const;
export type OrthogonalDirection = typeof OrthogonalDirections[number];
export const Directions = ['up', 'upright', 'right', 'downright', 'down', 'downleft', 'left', 'upleft'] as const;
export type Direction = typeof Directions[number];

export const Deltas: Record<Direction, Coord> = {
    'up': [-1, 0],
    'down': [1, 0],
    'left': [0, -1],
    'right': [0, 1],
    'downright': [1, 1],
    'downleft': [1, -1],
    'upright': [-1, 1],
    'upleft': [-1, -1]
};

export const angles = [90, 45, 0, -45, -90, -135, 180, 135] as const;
export type Angle = typeof angles[number];

export const angleOfDirection = (dir: Direction): Angle => {
    return angles[Directions.indexOf(dir)];
}

export const normalizeAngle = (a: number): Angle => {
    if (a % 45 != 0) 
        throw new Error(`Angle ${a} is not divisible by 45`);

    while(a < -135) a += 360;
    while(a > 180) a -= 360;
    return a as Angle;
}


export const rotate = (dir: Direction, amt: Angle) => {
    return Directions[(Directions.indexOf(dir) + (amt / 45) + Directions.length) % Directions.length];
}

export const oppositeDirection = (dir: Direction): Direction => {
    return rotate(dir, 180);
}

export const moveCoord = (c: Coord, dir: Direction, scale = 1): Coord => {
    return addCoord(c, scaleCoord(Deltas[dir], scale));
}

/**
 * Rotate's a coordinate around the origin.
 * Warning: A rounding operation is performed at the end to ensure an integral value.
 * This may be undesirable in some cases.
 * @param param0 
 * @param amt 
 * @returns 
 */
export const rotateCoord = ([r, c]: Coord, amt: Angle): Coord => {
    const rad = (amt / 180) * Math.PI;
    const sr = Math.sin(rad);
    const cr = Math.cos(rad);
    return [Math.round(c * sr + r * cr), Math.round(c * cr - r * sr)];
}

export const addCoord = ([r1, c1]: Coord, [r2, c2]: Coord): Coord => [r1 + r2, c1 + c2];
export const subCoord = ([r1, c1]: Coord, [r2, c2]: Coord): Coord => [r1 - r2, c1 - c2];
const ads = (a: number, b: number) => Math.pow(Math.abs(a - b), 2);
export const distCoord = ([r1, c1]: Coord, [r2, c2]: Coord): number => Math.sqrt(ads(r1, r2) + ads(c1, c2));
export const distCoordFast = ([r1, c1]: Coord, [r2, c2]: Coord): number => Math.sqrt(ads(r1, r2) + ads(c1, c2));
export const rectilinear = ([r1, c1]: Coord, [r2, c2]: Coord): number => Math.abs(r1 - r2) + Math.abs(c1 - c2);
export const eqCoord = ([r1, c1]: Coord, [r2, c2]: Coord): boolean => r1 == r2 && c1 == c2;
export const multCoord = ([r1, c1]: Coord, [r2, c2]: Coord): Coord => [r1 * r2, c1 * c2];
export const scaleCoord = ([r1, c1]: Coord, v: number): Coord => [r1 * v, c1 * v];

export const translate = ([tr, tc]: Coord) => ([r, c]: Coord): Coord => [tr + r, tc + c];

export const printCoord = ([r, c]: Coord) => `${r},${c}`;
export const parseCoord = (s: string): Coord => s.split(',').map(Number) as Coord;

export const iterateOrthogonal = ([r1, c1]: Coord, [r2, c2]: Coord, predicate: (c: Coord) => void) => {
    if (!isOrthogonal([r1, c1], [r2, c2]))
        throw new Error(`Points [${r1},${c1}] and [${r2},${c2}] are not orthogonal`);

    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    let r = r1;
    let c = c1;
    while (!(r == r2 && c == c2)) {
        predicate([r, c]);
        r += dr;
        c += dc;
    }
    predicate([r, c]);
}

export const iterateDiagonal = ([r1, c1]: Coord, [r2, c2]: Coord, predicate: (c: Coord) => void) => {
    if (!isDiagonal([r1, c1], [r2, c2]))
        throw new Error(`Points [${r1},${c1}] and [${r2},${c2}] are not diagonal`);

    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    let r = r1;
    let c = c1;
    while (!(r == r2 && c == c2)) {
        predicate([r, c]);
        r += dr;
        c += dc;
    }
    predicate([r, c]);
}

export const isOrthogonal = ([r1, c1]: Coord, [r2, c2]: Coord) => {
    return r1 == r2 || c1 == c2;
}

export const isDiagonal = ([r1, c1]: Coord, [r2, c2]: Coord) => {
    const rz = Math.abs(r2 - r1);
    const cz = Math.abs(c2 - c1);

    return rz == cz;
}

export const wrapCoord = (r1: number, c1: number, r2: number, c2: number) => ([r, c]: Coord): Coord => {
    const rd = r2 - r1;
    const cd = c2 - c1;
    if (r < r1) r = (((r - r1) % rd) + rd) + r1;
    else if (r >= r2) r = ((r - r1) % rd) + r1;
    if (c < c1) c = (((c - c1) % cd) + cd) + c1;
    else if (c >= c2) c = ((c - c1) % cd) + c1;
    return [r, c];
}

export type GridPredicate<T, R = void> = (val: T, r: number, c: number, g: Grid<T>) => R;

export type GridEntry<T> = {
    coord: Coord,
    val: T
}

export class Grid<T> {

    public static from<T>(r: number, c: number, fill: T) {
        const rows = Array(r);
        for (let i = 0; i < r; i++) {
            rows[i] = Array(c).fill(fill);
        }
        return new Grid<T>(rows);
    }

    public static fromLines<T>(lines: string[], predicate: (val: string) => T): Grid<T> {
        const rows = lines.map(line => [...line].map(predicate));
        return new Grid<T>(rows);
    }

    constructor(items: T[][]) {
        this.grid = items;
    }

    public readonly grid: T[][];

    public get height() { return this.grid.length; }
    public get width() { return this.grid[0].length; }
    public get size(): Coord { return [this.height, this.width]; }

    public every<S extends T>(predicate: (val: T, r: number, c: number, g: Grid<T>) => val is S): this is Grid<S> {
        return this.grid.every((row, r) => row.every((val, c) => predicate(val, r, c, this)));
    }

    public some(predicate: GridPredicate<T, boolean>): boolean {
        return this.grid.some((row, r) => row.some((val, c) => predicate(val, r, c, this)));
    }

    public forEach(callbackfn: GridPredicate<T>): void {
        return this.grid.forEach((row, r) => row.forEach((val, c) => callbackfn(val, r, c, this)));
    }

    public map<U>(callbackfn: GridPredicate<T, U>): Grid<U> {
        return new Grid(this.grid.map((row, r) => row.map((val, c) => callbackfn(val, r, c, this))));
    }

    public filter(predicate: (value: T, r: number, c: number, g: Grid<T>) => boolean): GridEntry<T>[]
    public filter<S extends T>(predicate: (value: T, r: number, c: number, g: Grid<T>) => value is S): GridEntry<S>[] {
        const vals: GridEntry<S>[] = [];
        this.grid.forEach((row, r) => row.forEach((val, c) => {
            if (predicate(val, r, c, this)) vals.push({ coord: [r, c], val });
        }));
        return vals;
    }

    public find(predicate: (value: T, r: number, c: number, g: Grid<T>) => boolean): GridEntry<T> | undefined
    public find<S extends T>(predicate: (value: T, r: number, c: number, g: Grid<T>) => value is S): GridEntry<S> | undefined {
        let coord: Coord | undefined = undefined;
        let val: T | undefined = undefined;
        this.grid.find((row, r) => row.find((v, c) => {
            if (predicate(v, r, c, this)) {
                coord = [r, c];
                val = v;
                return true;
            }
            return false;
        }));
        if (val && coord) return { coord, val };
        return undefined;
    }

    public reduce<U>(callbackfn: (previousValue: U, currentValue: T, r: number, c: number, g: Grid<T>) => U, initialValue: U): U {
        let acc = initialValue;
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                acc = callbackfn(acc, this.at([r, c])!, r, c, this);
            }
        }
        return acc;
    }

    public slice(r1?: number, c1?: number, r2?: number, c2?: number): Grid<T> {
        const g = this.grid.slice(r1, r2).map(row => row.slice(c1, c2));
        return new Grid(g);
    }

    public at([r, c]: Coord) {
        return this.grid.at(r)?.at(c);
    }

    /**
     * Warning: This method wraps around the array.
     * @param param0 
     * @param dir 
     * @returns 
     */
    public atDirectionWrap([r, c]: Coord, dir: Direction) {
        return this.at(moveCoord([r, c], dir));
    }

    public atDirectionRaw([r, c]: Coord, dir: Direction) {
        return this.atRaw(moveCoord([r, c], dir));
    }

    public iterateDirection([r, c]: Coord, dir: Direction, predicate?: GridPredicate<T | undefined, boolean>): GridEntry<T>[] {
        // by default use a predicate that stays in bounds.
        predicate = predicate ?? ((_, r, c) => r >= 0 && c >= 0 && r < this.height && c < this.width);

        let vals: GridEntry<T>[] = [];
        const [dr, dc] = Deltas[dir];
        let [nr, nc] = [r + dr, c + dc];
        let val = this.at([nr, nc]);
        while (val !== undefined && predicate(val, nr, nc, this)) {
            vals.push({ coord: [nr, nc], val });
            nr += dr;
            nc += dc;
            val = this.at([nr, nc]);
        }
        return vals;
    }

    public atRaw([r, c]: Coord) {
        const row = this.grid[r];
        if (row)
            return row[c];
        return undefined;
    }

    public rowAt(r: number) {
        return this.grid.at(r);
    }

    public wrap([r, c]: Coord): Coord {
        r = ((r % this.height) + this.height) % this.height;
        c = ((c % this.width) + this.width) % this.width;
        return [r, c];
    }

    public atWrap(c: Coord) {
        return this.at(this.wrap(c))
    }

    public set([r, c]: Coord, val: T) {
        return this.grid[r][c] = val;
    }

    public in([r, c]: Coord): boolean {
        if (r < 0 || c < 0 || r >= this.height || c >= this.width)
            return false;
        return true;
    }

    public growRows(rows: number, fill: T) {
        for (let r = 0; r < rows; r++) {
            this.grid.push(Array(this.width).fill(fill));
        }
    }

    public pushRow(row: T[]) {
        this.grid.push(row);
    }

    public growRowsTop(rows: number, fill: T) {
        for (let r = 0; r < rows; r++) {
            this.grid.unshift(Array(this.width).fill(fill));
        }
    }

    public growCols(cols: number, fill: T) {
        for (let r = 0; r < this.height; r++) {
            this.grid[r].push(...Array(cols).fill(fill));
        }
    }

    public growColsLeft(cols: number, fill: T) {
        for (let r = 0; r < this.height; r++) {
            this.grid[r].unshift(...Array(cols).fill(fill));
        }
    }

    public sliceRows(rowsStart: number, rowsEnd?: number) {
        return new Grid(this.grid.slice(rowsStart, rowsEnd));
    }

    public print(predicate?: GridPredicate<T, string>) {
        let p: GridPredicate<T, string>;
        if (!predicate) {
            p = (v: T) => (String(v));
        }
        else {
            p = predicate;
        }
        console.log(this.grid.map((row, r) => row.map((val, c) => p(val, r, c, this)).join('')).join('\n'));
    }

    public flipVertical(): Grid<T> {
        const g = this.grid.slice().map(row => row.slice());
        g.reverse();
        return new Grid(g);
    }

    public flipHorizontal(): Grid<T> {
        const g = this.grid.slice().map(row => row.slice().reverse());
        return new Grid(g);
    }

    public rotateRight(): Grid<T> {

        const nh = this.width;
        const nw = this.height;

        const rows = Array(nh);
        for (let r = 0; r < nh; r++) {
            rows[r] = Array(nw);
            for (let c = 0; c < nw; c++) {
                rows[r][c] = this.at([this.height - (c + 1), r]);
            }
        }

        return new Grid<T>(rows);
    }

    public blit([r, c]: Coord, g: Grid<T>, transparency?: T) {
        const maxr = r + g.height > this.height ? g.height - ((r + g.height) - this.height) : g.height;
        const maxc = c + g.width > this.width ? g.width - ((c + g.width) - this.width) : g.width;

        for (let ri = 0; ri < maxr; ri++) {
            for (let ci = 0; ci < maxc; ci++) {
                const v = g.at([ri, ci]);
                if (v && v !== transparency) {
                    this.set([r + ri, c + ci], v);
                }
            }
        }
    }

    public * row(r: number) {
        for (let c = 0; c < this.width; c++) {
            yield this.grid[r][c];
        }
    }

    public * column(c: number) {
        for (let r = 0; r < this.height; r++) {
            yield this.grid[r][c];
        }
    }

    public * rows() {
        for (let r = 0; r < this.height; r++) {
            yield this.row(r);
        }
    }

    public * columns() {
        for (let c = 0; c < this.width; c++) {
            yield this.column(c);
        }
    }

    public rank(rank: number, index: number) {
        if (rank == 0) return this.row(index);
        if (rank == 1) return this.column(index);
        throw new Error(`Rank ${rank} is not supported`);
    }

    public * ranks(rank: number) {
        if (rank == 0) {
            for (let r = 0; r < this.height; r++) {
                yield this.row(r);
            }
        }
        else if (rank == 1) {
            for (let c = 0; c < this.width; c++) {
                yield this.column(c);
            }
        }
        else {
            throw new Error(`Rank ${rank} is not supported`);
        }
    }

    public insertColumn(c: number, fill: T) {
        for (let r = 0; r < this.height; r++) {
            this.grid[r].splice(c, 0, fill);
        }
    }

    public insertRow(r: number, fill: T) {
        this.grid.splice(r, 0, Array(this.width).fill(fill));
    }

    public clone() {
        return new Grid(this.grid.map(row => row.slice()));
    }
}
