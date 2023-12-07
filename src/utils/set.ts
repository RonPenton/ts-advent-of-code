import { Iter } from "./iter";

/**
 * A new collection containing all the elements of both collections.
 * @param a 
 * @param b 
 * @returns 
 */
export const union = <T>(a: Set<T> | readonly T[], b: Set<T> | readonly T[]) => {
    const aa = a instanceof Set ? a : new Set(a);
    const bb = b instanceof Set ? b : new Set(b);
    return new Set<T>([...aa, ...bb]);
}

/**
 * A new collection containing only the elements that appear in both collections.
 * @param a 
 * @param b 
 * @returns 
 */
export const intersection = <T>(a: Set<T> | readonly T[], b: Set<T> | readonly T[]) => {
    const aa = a instanceof Set ? new Iter(a.values()) : new Iter(a);
    const bb = b instanceof Set ? b : new Set(b);
    return new Set<T>(aa.filter(x => bb.has(x)));
}

/**
 * A new collection containing only the elements that appear in the first collection but not the second.
 * @param a 
 * @param b 
 * @returns 
 */
export const difference = <T>(a: Set<T> | readonly T[], b: Set<T> | readonly T[]) => {
    const aa = a instanceof Set ? new Iter(a.values()) : new Iter(a);
    const bb = b instanceof Set ? b : new Set(b);
    return new Set<T>(aa.filter(x => !bb.has(x)));
}

export const unique = <T>(a: Set<T> | readonly T[]) => {
    const aa = a instanceof Set ? a : new Set(a);
    return aa;
}
