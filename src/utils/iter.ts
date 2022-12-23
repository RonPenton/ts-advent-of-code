export class Iter<T> implements IterableIterator<T> {

    public iter: IterableIterator<T>;

    public constructor(c: ArrayLike<T> | IterableIterator<T>) {
        if ('length' in c) {
            const arr = c;
            function* f() {
                for (let i = 0; i < arr.length; i++) {
                    yield arr[i];
                }
            }
            this.iter = f();
        }
        else {
            this.iter = c;
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
        return initial;
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
                    return;
                }

                idx++;
                next = me.next();
            }
        }
        return new Iter(f());
    }

    public skip(count: number): Iter<T>;
    public skip<S extends T>(predicate: (value: T, index: number) => value is S): Iter<S>;
    public skip(predicate: (value: T, index: number) => boolean): Iter<T>;
    public skip(predicate: any): unknown {
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
                if (Array.isArray(j)) {
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

    /**
     * Converts an iterator to an array. Warning: Slow. 
     * @returns 
     */
    public array(): T[] {
        const arr: T[] = [];
        this.forEach(v => arr.push(v));
        return arr;
    }
}

type Flat<Itr> = Itr extends Iter<infer Inner> ? Inner : Itr extends ArrayLike<infer Inner> ? Inner : Itr;
