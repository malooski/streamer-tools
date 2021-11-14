import Immutable from "immutable";

export function toggleImSet<T>(set: Immutable.Set<T>, item: T): Immutable.Set<T> {
    if (set.has(item)) {
        return set.delete(item);
    } else {
        return set.add(item);
    }
}
