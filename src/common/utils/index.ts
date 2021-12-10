const _Object = {
    ...Object,
    keys<T>(o: T): (keyof T)[] {
        return Object.keys(o) as (keyof T)[];
    },
};

export { _Object as Object };
