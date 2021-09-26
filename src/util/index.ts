export function mapValue<T, U>(
    value: T | null | undefined,
    func: (v: T) => U
): U | null | undefined {
    if (value == null) {
        return value as null | undefined;
    }

    return func(value);
}

export function filterIdx<T>(items: T[], idx: number) {
    return [...items.slice(0, idx), ...items.slice(idx + 1)];
}
