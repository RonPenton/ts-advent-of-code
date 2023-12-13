
/**
 * Allows an iterator to be used after a function like take has been called on it.
 * @param val 
 * @param itr 
 */
function* cont<T>(val: T, itr: IterableIterator<T>): IterableIterator<T> {
    yield val;
    yield* itr;
}

export class Iter<T> implements IterableIterator<T> {

    public iter: IterableIterator<T>;
    private baseArray: T[] | undefined = undefined;
    private currentLocation: number | undefined = undefined

    public continue: IterableIterator<T>;

    public constructor(c: ArrayLike<T> | Array<T> | IterableIterator<T>, startIndex?: number) {
        if ('length' in c) {

            if (Array.isArray(c)) {
                this.baseArray = c;
            }

            const me = this;
            this.currentLocation = 0;
            function* f(arr: ArrayLike<T>) {
                for (let i = 0; i < arr.length; i++) {
                    me.currentLocation = i + 1;
                    yield arr[i];
                }
            }
            this.iter = f(c);
            this.continue = this.iter;
        }
        else {
            this.iter = c;
            this.continue = c;
        }
    }

    [Symbol.iterator]() { return this.iter }

    next(...args: [] | [undefined]): IteratorResult<T, any> {
        return this.iter.next(...args);
    }

    public static from<T>(arr: ArrayLike<T>) {
        function* f() {
            for (let i = 0; i < arr.length; i++) {
                yield arr[i];
            }
        }
        return new Iter(f());
    }

    public static range(a: number, b?: number, skip = 1): Iter<number> {
        function* r() {
            if (!b) {
                b = a;
                a = 0;
            }

            while (a < b) {
                yield a;
                a += skip;
            }
        }

        return new Iter(r());
    }

    public static fill<T>(size: number, value: T): Iter<T> {
        function* r() {
            for (let i = 0; i < size; i++) {
                yield value;
            }
        }

        return new Iter(r());
    }


    public filter<S extends T>(predicate: (value: T, index: number) => value is S): Iter<S>;
    public filter(predicate: (value: T, index: number) => boolean): Iter<T>;
    public filter(predicate: (value: T, index: number) => unknown): unknown {
        const me = this;
        function* f() {
            let next = me.iter.next();
            let idx = 0;

            while (!next.done) {
                if (predicate(next.value, idx)) {
                    yield next.value;
                }

                idx++;
                next = me.next();
            }
        }
        return new Iter(f());
    }

    public find<S extends T>(predicate: (value: T, index: number) => value is S): S | undefined;
    public find(predicate: (value: T, index: number) => unknown): T | undefined;
    public find(predicate: (value: T, index: number) => unknown) {
        let next = this.iter.next();
        let idx = 0;
        while (!next.done) {
            if (predicate(next.value, idx)) {
                return next.value;
            }

            idx++;
            next = this.iter.next();
        }

        return undefined;
    }

    /**
     * Finds the first index that matches the predicate, or -1 if not found.
     * @param predicate 
     * @returns 
     */
    public findIndex(predicate: (value: T, index: number) => boolean): number {
        let next = this.iter.next();
        let idx = 0;
        while (!next.done) {
            if (predicate(next.value, idx)) {
                return idx;
            }

            idx++;
            next = this.iter.next();
        }

        return -1;
    }

    public map<U>(mapper: (value: T, index: number) => U) {
        const me = this;
        function* m() {
            let next = me.iter.next();
            let idx = 0;

            while (!next.done) {
                yield mapper(next.value, idx)
                idx++;
                next = me.iter.next();
            }
        }

        return new Iter(m());
    }

    public reduce<U>(reducer: (previous: U, current: T, index: number) => U,
        initial: U
    ): U {
        let next = this.iter.next();
        let idx = 0;
        let acc = initial;

        while (!next.done) {
            acc = reducer(acc, next.value, idx);
            idx++;
            next = this.iter.next();
        }
        return acc;
    }

    public take(count: number): Iter<T>;
    public take<S extends T>(predicate: (value: T, index: number) => value is S): Iter<S>;
    public take(predicate: (value: T, index: number) => boolean): Iter<T>;
    public take(predicate: any): unknown {
        const me = this;

        let p = typeof predicate == 'number' ? (_: T, i: number) => i < predicate : predicate;

        function* f() {
            let next = me.iter.next();
            let idx = 0;

            while (!next.done) {
                if (p(next.value, idx)) {
                    yield next.value;
                }
                else {
                    me.continue = cont(next.value, me.iter);
                    return;
                }

                idx++;
                next = me.next();
            }
        }
        return new Iter(f());
    }


    public bifurtake(count: number): [Iter<T>, Iter<T>];
    public bifurtake<S extends T>(predicate: (value: T, index: number) => value is S): [Iter<S>, Iter<T>];
    public bifurtake(predicate: (value: T, index: number) => boolean): [Iter<T>, Iter<T>];
    public bifurtake(predicate: any): unknown {
        const me = this;

        let p = typeof predicate == 'number' ? (_: T, i: number) => i < predicate : predicate;

        let next = me.iter.next();

        const taken = function () {
            let idx = 0;
            const t: T[] = []
            while (!next.done) {
                if (p(next.value, idx)) {
                    t.push(next.value);
                }
                else {
                    return t;
                }

                idx++;
                next = me.next();
            }
            return t;
        }();


        function* f() {
            while (!next.done) {
                yield next.value;
                next = me.next();
            }
        }
        return [new Iter(taken), new Iter(f())];
    }


    public skip(count: number): Iter<T>;
    public skip(predicate: (value: T, index: number) => boolean): Iter<T>;
    public skip(predicate: any): Iter<T> {
        const me = this;

        let p = typeof predicate == 'number' ? (_: T, i: number) => i < predicate : predicate;

        function* f() {
            let next = me.iter.next();
            let idx = 0;
            let reached = false;

            while (!next.done) {
                if (!reached) {
                    reached = !p(next.value, idx);
                }
                if (reached) {
                    yield next.value;
                }

                idx++;
                next = me.next();
            }
        }
        return new Iter(f());
    }

    /**
     * Cartesian Product of the two iterators.
     * Second iterator is fully materialized so that it can be iterated over multiple times, 
     * so careful about memory usage.
     * @param other 
     * @returns 
     */
    public product<U>(other: Iter<U>): Iter<[T, U]> {
        const me = this;

        function* f() {
            const otherArr = other.array();
            let next = me.iter.next();

            while (!next.done) {
                for (const u of otherArr) {
                    yield [next.value, u] as [T, U];
                }
                next = me.next();
            }
        }
        return new Iter(f());
    }

    /**
     * Combinations of the iterator values.
     * The iterator is fully materialized so that it can be iterated over multiple times, 
     * so careful about memory usage.
     * @param other 
     * @returns 
     */
    public combinations(): Iter<[T, T]> {
        const me = this;
        function* f() {
            const arr = me.array();
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    yield [arr[i], arr[j]] as [T, T];
                }
            }
        }
        return new Iter(f());
    }

    /**
     * Permutations of the iterator values.
     * The iterator is fully materialized so that it can be iterated over multiple times, 
     * so careful about memory usage.
     * @param other 
     * @returns 
     */
    public permutations(): Iter<[T, T]> {
        const me = this;

        function* f() {
            const arr = me.array();
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    if (i !== j) {
                        yield [arr[i], arr[j]] as [T, T];
                    }
                }
            }

        }
        return new Iter(f());
    }

    /**
     * Iterates over the list until it is exhausted, then continues to cycle over
     * the list indefinitely, or for the specified number of times.
     * The iterator is fully materialized so that it can be iterated over multiple times, 
     * so careful about memory usage.
     * @param other 
     * @returns 
     */
    public cycle(cycles?: number): Iter<T> {
        const me = this;
        function* f() {
            const cache: T[] = []
            let next = me.iter.next();
            while (!next.done) {
                cache.push(next.value);
                yield next.value;
                next = me.next();
            }
            while (cycles === undefined || --cycles) {
                for (const c of cache) {
                    yield c;
                }
            }
        }
        return new Iter(f());
    }

    public pairwise(): Iter<[T, T]> {
        const me = this;

        function* f() {
            let last = me.iter.next();
            let next = me.iter.next();
            while (!next.done) {
                yield [last.value, next.value] as [T, T];
                last = next;
                next = me.iter.next();
            }
        }
        return new Iter(f());
    }

    public forEach(predicate: (value: T, index: number) => void): void {
        let next = this.iter.next();
        let i = 0;
        while (!next.done) {
            predicate(next.value, i)
            next = this.iter.next();
            i++;
        }
    }

    public concat<U>(i: IterableIterator<U>): Iter<T | U> {
        const me = this;
        function* f() {
            for (const a of me.iter) yield a;
            for (const b of i) yield b;
        }
        return new Iter(f());
    }

    public unique(): Iter<T>;
    public unique<U>(picker: (value: T, index: number) => U): Iter<T>;
    public unique<U>(picker?: (value: T, index: number) => U): Iter<T> {
        const iter = this.iter;
        const p = picker ? picker : (t: T) => t;
        function* f() {
            const set = new Set();
            let i = 0;
            for (const a of iter) {
                const u = p(a, i);
                if (!set.has(u)) {
                    set.add(u);
                    yield a;
                }
            }
        }
        return new Iter(f());
    }

    public intersection(i: IterableIterator<T>): Iter<T>;
    public intersection(i: ArrayLike<T>): Iter<T>;
    public intersection<V>(i: IterableIterator<T>, picker: (value: T, index: number) => V): Iter<T>;
    public intersection<V>(i: ArrayLike<T>, picker: (value: T, index: number) => V): Iter<T>;
    public intersection<U, V>(i: IterableIterator<U>, picker: (value: T | U, index: number) => V): Iter<T>;
    public intersection<U, V>(i: ArrayLike<U>, picker: (value: T | U, index: number) => V): Iter<T>;
    public intersection(i: IterableIterator<any> | ArrayLike<any>, picker?: (value: any, index: number) => any) {
        const me = this;
        const p = picker ? picker : (t: T) => t;
        function* f() {
            const set = new Set(new Iter(i).map(p));
            let idx = 0;
            for (const a of me) {
                if (set.has(p(a, idx))) {
                    yield a;
                }
                idx++;
            }
        }
        return new Iter(f());
    }

    public union(i: IterableIterator<T>): Iter<T>;
    public union(i: Array<T>): Iter<T>;
    public union<V>(i: IterableIterator<T>, picker: (value: T, index: number) => V): Iter<T>;
    public union<V>(i: Array<T>, picker: (value: T, index: number) => V): Iter<T>;
    public union<U, V>(i: IterableIterator<U>, picker: (value: T | U, index: number) => V): Iter<T>;
    public union<U, V>(i: Array<U>, picker: (value: T | U, index: number) => V): Iter<T>;
    public union(i: IterableIterator<any> | Array<any>, picker?: (value: any, index: number) => any) {
        const me = this;
        const p = picker ? picker : (t: T) => t;
        function* f() {
            const seen = new Set();
            let idx = 0;
            for (const a of me) {
                const v = p(a, idx);
                if (!seen.has(v)) {
                    seen.add(v);
                    yield a;
                }
                idx++;
            }

            for (const a of i) {
                const v = p(a, idx);
                if (!seen.has(v)) {
                    seen.add(v);
                    yield a;
                }
                idx++;
            }
        }
        return new Iter(f());
    }


    public except(i: IterableIterator<T>): Iter<T>;
    public except<V>(i: IterableIterator<T>, picker: (value: T, index: number) => V): Iter<T>;
    public except<U, V>(i: IterableIterator<U>, picker: (value: T | U, index: number) => V): Iter<T>;
    public except(i: ArrayLike<T>): Iter<T>;
    public except<V>(i: ArrayLike<T>, picker: (value: T, index: number) => V): Iter<T>;
    public except<U, V>(i: ArrayLike<U>, picker: (value: T | U, index: number) => V): Iter<T>;
    public except(i: IterableIterator<any> | ArrayLike<any>, picker?: (value: any, index: number) => any) {
        const me = this;
        const p = picker ? picker : (t: T) => t;
        function* f() {
            const set = new Set(new Iter(i).map(p));
            let idx = 0;
            for (const a of me) {
                if (!set.has(p(a, idx))) {
                    yield a;
                }
                idx++;
            }
        }
        return new Iter(f());
    }

    public zip<U>(i: IterableIterator<U>): Iter<[T | undefined, U | undefined]>;
    public zip<U, V>(u: IterableIterator<U>, v: IterableIterator<V>): Iter<[T | undefined, U | undefined, V | undefined]>;
    public zip<U, V, W>(u: IterableIterator<U>, v: IterableIterator<V>, w: IterableIterator<W>): Iter<[T | undefined, U | undefined, V | undefined, W | undefined]>;
    public zip(...i: IterableIterator<any>[]): Iter<any[]> {
        i.unshift(this);
        function* f() {
            let nexts = i.map(j => j.next());
            while (nexts.filter(x => !x.done).length > 0) {
                yield nexts.map(x => x.value);
                nexts = i.map(j => j.next());
            }
        }
        return new Iter(f());
    }

    public isSubsetOf(i: IterableIterator<T>): boolean;
    public isSubsetOf<V>(i: IterableIterator<T>, picker: (value: T, index: number) => V): boolean;
    public isSubsetOf<U, V>(i: IterableIterator<U>, picker: (value: T | U, index: number) => V): boolean;
    public isSubsetOf(i: ArrayLike<T>): boolean;
    public isSubsetOf<V>(i: ArrayLike<T>, picker: (value: T, index: number) => V): boolean;
    public isSubsetOf<U, V>(i: ArrayLike<U>, picker: (value: T | U, index: number) => V): boolean;
    public isSubsetOf(i: IterableIterator<any> | ArrayLike<any>, picker?: (value: any, index: number) => any) {
        const p = picker ? picker : (t: T) => t;
        const set = new Set(new Iter(i).map(p));
        let idx = 0;
        for (const a of this) {
            if (!set.has(p(a, idx))) {
                return false;
            }
            idx++;
        }
        return true;
    }

    public setEquals(i: IterableIterator<T>): boolean;
    public setEquals<V>(i: IterableIterator<T>, picker: (value: T, index: number) => V): boolean;
    public setEquals<U, V>(i: IterableIterator<U>, picker: (value: T | U, index: number) => V): boolean;
    public setEquals(i: ArrayLike<T>): boolean;
    public setEquals<V>(i: ArrayLike<T>, picker: (value: T, index: number) => V): boolean;
    public setEquals<U, V>(i: ArrayLike<U>, picker: (value: T | U, index: number) => V): boolean;
    public setEquals(i: IterableIterator<any> | ArrayLike<any>, picker?: (value: any, index: number) => any) {
        const p = picker ? picker : (t: T) => t;
        const s1 = new Set(new Iter(i).map(p));
        const s2 = new Set(this.map(p));
        const i1 = new Iter(s1.values());
        const i2 = new Iter(s2.values());
        return i1.every(x => s2.has(x)) && i2.every(x => s1.has(x));
    }

    public groupBy<U>(picker: (value: T, index: number) => U): Iter<[U, Iter<T>]> {
        const map = new Map<U, T[]>();
        let idx = 0;
        for (const i of this) {
            const u = picker(i, idx);
            let entry = map.get(u);
            if (!entry) {
                entry = [];
                map.set(u, entry);
            }
            entry.push(i);
        }
        return new Iter(map.entries()).map(([k, v]) => [k, Iter.from(v)]);
    }

    public flat(): Iter<Flat<T>> {
        const iter = this.iter;
        function* f() {
            for (const i of iter) {
                let j: any = i;
                if(j === undefined) {
                    yield j;
                }
                else if (Array.isArray(j)) {
                    for (const k of j) yield k;
                }
                else if (typeof j[Symbol.iterator] === 'function') {
                    for (const k of j) yield k;
                }
                else {
                    yield j;
                }
            }
        }
        return new Iter(f());
    }

    public head(): T | undefined {
        const me = this;
        const next = me.iter.next();
        return next.value;
    }

    public tail(): Iter<T> {
        return this.skip(1);
    }

    public sort(comp: (a: T, b: T) => number): Iter<T> {
        const arr = this.array().sort(comp);
        return Iter.from(arr);
    }

    public flatMap<U>(mapper: (value: T, index: number) => U | ArrayLike<U> | Iter<U>): Iter<U | Flat<U>> {
        return this.map(mapper).flat();
    }

    public every(predicate: (value: T, index: number) => boolean): boolean;
    public every<S extends T>(predicate: (value: T, index: number) => value is S): this is Iter<S> {
        const me = this;
        let next = me.iter.next();
        let idx = 0;
        while (!next.done) {
            if (!predicate(next.value, idx)) {
                return false;
            }
            idx++;
            next = me.next();
        }
        return true;
    }

    public some(predicate: (value: T, index: number) => boolean): boolean {
        let next = this.iter.next();
        let idx = 0;
        while (!next.done) {
            if (predicate(next.value, idx)) {
                return true;
            }
            idx++;
            next = this.next();
        }
        return false;
    }

    public count(predicate?: (value: T, index: number) => boolean) {
        const p = predicate ? predicate : (t: T) => !!t;
        let next = this.iter.next();
        let idx = 0;
        let c = 0;
        while (!next.done) {
            if (p(next.value, idx)) {
                c++;
            }
            idx++;
            next = this.next();
        }
        return c;
    }

    public chunk(size: number): Iter<Iter<T>> {
        const me = this;
        function* f() {
            let take = me.take(size).array();
            while (take.length > 0) {
                yield Iter.from(take);
            }
        }
        return new Iter(f());
    }

    /**
     * Converts an iterator to an array. 
     * If the base collection is an array, the base collection will be returned. 
     * If the base collection is an iterator, then the iterator will be fully materialized. 
     * This will be slow and memory-intensive.
     * @returns 
     */
    public array(): T[] {
        if (this.baseArray) {
            if (this.currentLocation === undefined || this.currentLocation === 0) {
                // collection not iterated yet. Just return the same array.
                return this.baseArray;
            }
            else {
                // collection has been iterated. Return a slice of the array.
                return this.baseArray.slice(this.currentLocation);
            }
        }
        const arr: T[] = [];
        this.forEach(v => arr.push(v));
        return arr;
    }

    public restart(): Iter<T> {
        if (!this.baseArray) {
            throw Error("Cannot restart an iterator that is not based on an array.");
        }
        return Iter.from(this.baseArray);
    }
}

type Flat<Itr> = Itr extends Iter<infer Inner> ? Inner : Itr extends ArrayLike<infer Inner> ? Inner : Itr;

export function iter<T>(arr: ArrayLike<T> | T[] | IterableIterator<T>) {
    return new Iter(arr);
}
