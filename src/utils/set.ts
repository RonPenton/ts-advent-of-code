import { Iter } from "./iter";

export const union = <T>(a: Set<T> | T[], b: Set<T> | T[]) => {
    const aa = a instanceof Set ? a : new Set(a);
    const bb = b instanceof Set ? b : new Set(b);
    return new Set<T>([...aa, ...bb]);
}

export const intersection = <T>(a: Set<T> | T[], b: Set<T> | T[]) => {
    const aa = a instanceof Set ? new Iter(a.values()) : new Iter(a);
    const bb = b instanceof Set ? b : new Set(b);
    return new Set<T>(aa.filter(x => bb.has(x)));
}

export const difference = <T>(a: Set<T> | T[], b: Set<T> | T[]) => {
    const aa = a instanceof Set ? new Iter(a.values()) : new Iter(a);
    const bb = b instanceof Set ? b : new Set(b);
    return new Set<T>(aa.filter(x => !bb.has(x)));
}
