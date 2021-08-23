export function mapValue<T, U>(
    value: T | null | undefined,
    func: (v: T) => U
): U | null | undefined {
    if (value == null) {
        return value as null | undefined;
    }

    return func(value);
}
