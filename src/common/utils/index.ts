type Keys<T> = (keyof T)[];
type Values<T> = T[keyof T][];

const _Object = {
    ...Object,
    keys<T>(o: T): Keys<T> {
        return Object.keys(o) as Keys<T>;
    },
    values<T>(o: T): Values<T> {
        return Object.values(o) as Values<T>;
    },
};

export { _Object as Object };
