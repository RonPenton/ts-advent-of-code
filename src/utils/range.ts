export type Range = readonly [number, number];

export const between = ([a, b]: Range) => (n: number) => n >= a && n <= b;

export const rangeIntersection = ([a, b]: Range, [c, d]: Range): Range | undefined => {
    if (a > d || c > b) return undefined;
    return [Math.max(a, c), Math.min(b, d)];
}

export const rangeDifference = ([a, b]: Range, [c, d]: Range): Range[] => {
    if (a > d || c > b) return [[a, b]];
    if (a < c && b > d) return [[a, c - 1], [d + 1, b]];
    if (a < c) return [[a, c - 1]];
    if (b > d) return [[d + 1, b]];
    return [];
}

export const rangeUnion = ([a, b]: Range, [c, d]: Range): Range[] => {
    if (a > d || c > b) return [[a, b], [c, d]];
    return [[Math.min(a, c), Math.max(b, d)]];
}

export const rangesSubtract = (ranges: Range[], toRemove: Range): Range[] => {
    const result: Range[] = [];
    for (const range of ranges) {
        const diff = rangeDifference(range, toRemove);
        result.push(...diff);
    }
    return rangesUnion(result);
}
export const rangesUnion = (ranges: Range[]): Range[] => {
    const sorted = ranges.sort((a, b) => a[0] - b[0]);
    const result: Range[] = [];
    let current = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        const union = rangeUnion(current, next);
        if (union.length === 1) {
            current = union[0];
        }
        else {
            result.push(current);
            current = next;
        }
    }
    if (current)
        result.push(current);
    return result;
}

export const rangesIntersection = (ranges: Range[], intersections: Range[]): Range[] => {
    const result: Range[] = [];
    for (const range of ranges) {
        for (const intersection of intersections) {
            const i = rangeIntersection(range, intersection);
            if (i) {
                result.push(i);
            }
        }
    }
    return rangesUnion(result);
}

export const rangeOffset = (offset: number) => (range: Range): Range => {
    const [a, b] = range;
    return [a + offset, b + offset];
}
