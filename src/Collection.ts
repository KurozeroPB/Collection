interface AbstractClass {
    name: string;
}

type Predicate<T> = (i: T) => boolean

export class Collection<T> extends Map<string | number, T> {
    private TName: string;

    /**
     * Another way is to use `base: new () => T` or `base: T&Function` but this does not work with abstract classes.
     *
     * @param {AbstractClass | null} [base] The type of the collection, even though it's optional it's better to always pass a param
     * @param {T[] | Record<string|number|symbol, T> | null} [from] Construct new Collection with items from array or object
     */
    public constructor(base?: AbstractClass | null, from?: T[] | Record<string|number|symbol, T> | null) {
        super();
        this.TName = base ? base.name : "any";

        if (from) {
            if (Array.isArray(from)) {
                for (let i = 0; i < from.length; i++) {
                    this.set(i, from[i]);
                }
            } else if (from instanceof Object) {
                for (const [key, value] of Object.entries(from)) {
                    this.set(key, value);
                }
            }
        }
    }

    /**
     * @since 0.4.0
     *
     * @returns {boolean} true if collection is empty else false
     */
    public get isEmpty(): boolean {
        return this.size === 0;
    }


    /**
     * @since 0.2.0
     *
     * Create a Collection from an Array or Object
     *
     * @param {any[] | Record<string|number|symbol, any>} x The array you want to create a collection from
     * @returns {Collection<any>} The created collection
     */
    public static from(x: any[] | Record<string|number|symbol, any>): Collection<any> {
        const col = new Collection();
        if (Array.isArray(x)) {
            for (let i = 0; i < x.length; i++) {
                col.set(i, x[i]);
            }
        } else if (x instanceof Object) {
            for (const [key, value] of Object.entries(x)) {
                col.set(key, value);
            }
        }
        return col;
    }

    /**
     * @since 0.3.4
     *
     * Merge multiple collections together
     *
     * @param {Collection<any>[]} collections All the collections you want to merge together
     */
    public static merge(...collections: Collection<any>[]): Collection<any> {
        const temp = new Collection<any>();
        for (let i = 0; i < collections.length; i++) {
            for (const [key, value] of collections[i].entries()) {
                temp.set(key, value);
            }
        }
        return temp;
    }

    /**
     * @since 0.2.0
     *
     * Simple set function
     * If `v` has an index named `_key` it will use it as the key
     *
     * @param {T} v Value to add to the collection
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String);
     * collection.add("foo");
     * // Collection {
     * //     0 => 'foo'
     * // }
     * ```
     */
    public add(v: T): void {
        if ((v as any)["_key"]) {
            this.set((v as any)["_key"], v);
        } else {
            this.set(this.size, v);
        }
    }

    /**
     * @since 0.3.3
     *
     * Add multiple items at once to the collection
     *
     * @param {T[] | Record<string|number|symbol, T>} x The array with items
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String);
     * collection.addMany(["foo", "bar", "baz", "123"]);
     * collection.addMany({ "foo": "bar", "baz": "123" });
     * // Collection {
     * //     0 => 'foo',
     * //     1 => 'bar',
     * //     2 => 'baz',
     * //     3 => '123',
     * //     'foo' => 'bar',
     * //     'baz' => '123'
     * // }
     * ```
     */
    public addMany(x: T[] | Record<string|number|symbol, T>): void {
        if (Array.isArray(x)) {
            for (let i = 0; i < x.length; i++) {
                this.set(this.size, x[i]);
            }
        } else if (x instanceof Object) {
            for (const [key, value] of Object.entries(x)) {
                this.set(key, value);
            }
        }
    }

    /**
     * @since 0.1.0
     *
     * Returns first matching Object or undefined if no match
     *
     * @param {Predicate<T>} fn A function that returns true if it matches the given param
     * @returns {T | undefined} The first matching object or undefined if none found
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String, ["foo", "bar", "baz", "123"]);
     * collection.find((item) => item === "foo");
     * // "foo"
     * ```
     */
    public find(fn: Predicate<T>): T | undefined {
        for (const item of this.values()) {
            if (fn(item)) return item;
        }
        return undefined;
    }

    /**
     * @since 0.1.0
     *
     * Returns an Array with all the elements that make the function evaluate true
     *
     * @param {Predicate<T>} fn A function that returns true if it matches the given param
     * @returns {T[]} An array with all the elements that evaluated true
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String, ["foo", "bar", "baz", "123"]);
     * collection.filter((item) => item.includes("a"));
     * // [
     * //     "bar",
     * //     "baz"
     * // ]
     * ```
     */
    public filter(fn: Predicate<T>): T[] {
        const results: T[] = [];
        for (const item of this.values()) {
            if (fn(item)) results.push(item);
        }
        return results;
    }

    /**
     * @since 0.1.0
     *
     * Returns an Array with the results of applying the given function to each element
     *
     * @param {Function} fn A function that returns a result
     * @returns {R[]} An array with the results
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String, ["foo", "bar", "baz", "123"]);
     * collection.map((v) => v.replace("a", "o"));
     * // [
     * //     "foo",
     * //     "bor",
     * //     "boz",
     * //     "123"
     * // ]
     * ```
     */
    public map<R>(fn: (v: T, i: number, a: Collection<T>) => R): R[] {
        const results: R[] = [];
        const arr = Array.from(this.values());
        for (let i = 0; i < arr.length; i++) {
            results.push(fn(arr[i], i, this));
        }
        return results;
    }

    /**
     * @since 0.1.0
     *
     * Merge two collections
     *
     * @param {Collection<T>} x A collection to merge together with this
     * @returns {Collection<T>} The merged collection
     */
    public merge(x: Collection<T>): Collection<T> {
        const temp = new Collection<T>();
        for (const [_, value] of this) {
            temp.add(value);
        }
        for (const [_, value] of x) {
            temp.add(value);
        }
        return temp;
    }

    /**
     * @since 0.1.0
     *
     * Returns a random Object from the Collection or undefined if the Collection is empty
     *
     * @returns {T|undefined} The random object or undefined if none exist
     */
    public random(): T | undefined {
        if (!this.size) return undefined;
        return Array.from(this.values())[Math.floor(Math.random() * this.size)];
    }

    /**
     * @since 0.1.0
     */
    public toString(): string {
        return `[Collection<${this.TName}>]`;
    }

    /**
     * @since 0.4.0
     *
     * Returns true if all element matche predicate.
     *
     * @param {Predicate<T>} fn A function that returns a result
     *
     * @returns {boolean}
     */
    public all(fn: Predicate<T>): boolean {
        let allTrue = false;
        for (const [_, value] of this) {
            if (fn(value)) allTrue = true;
            else allTrue = false;
        }
        return allTrue;
    }

    /**
     * @since 0.4.0
     *
     * Returns true if collection has at least one or if predicate is given true when atleast one element matches the predicate.
     *
     * @param {Predicate<T>} fn A function that returns a result
     *
     * @returns {boolean}
     */
    public any(fn?: Predicate<T> | null): boolean {
        if (fn) {
            for (const [_, value] of this) {
                if (fn(value)) return true;
            }
            return false;
        } else {
            return this.size >= 1;
        }
    }

    /**
     * @since 0.4.0
     *
     * Checks if element is in the collection
     *
     * @param {T} element Element you want to check
     *
     * @returns {boolean} true if element is in collection else false
     */
    public contains(element: T): boolean {
        for (const [_, value] of this) {
            if (element === value) return true;
        }
        return false;
    }

    /**
     * @since 0.4.0
     *
     * Checks if all values from given collection are in this collection
     *
     * @param {Collection<T>} collection The collection with values you want to check
     *
     * @returns {boolean} true if all values are in this collection else false
     */
    public containsAll(collection: Collection<T>): boolean {
        let containsAll = false;
        for (const [_, value] of collection) {
            if (this.contains(value)) containsAll = true;
            else containsAll = false;
        }
        return containsAll;
    }

    /**
     * @since 0.4.0
     *
     * Gives the number of items in the collection, if predicate is given the number of items that evaluated true
     *
     * @param {Predicate<T>} fn A function that returns a result
     *
     * @returns {number}
     */
    public count(fn?: Predicate<T> | null): number {
        if (fn) {
            let i = 0
            for (const [_, value] of this) {
                if (fn(value)) i++;
            }
            return i;
        } else {
            return this.size;
        }
    }

    /**
     * @since 0.4.0
     *
     * Convert collection values to array
     *
     * @returns {T[]}
     */
    public array(): T[] {
        const arr: T[] = [];
        for (const value of this.values()) {
            arr.push(value)
        }
        return arr;
    }

    /**
     * @since 0.4.0
     *
     * Convert collection to object
     *
     * @returns {Record<string|number|symbol, T>}
     */
    public object(): Record<string|number|symbol, T> {
        const obj: Record<string|number|symbol, T> = {};
        for (const [key, value] of this) {
            obj[key] = value;
        }
        return obj;
    }
}
