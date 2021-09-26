import { addHours, addMinutes, closestTo, set, setMinutes, subHours } from "date-fns";

export function mapValue<T, U>(
    value: T | null | undefined,
    func: (v: T) => U
): U | null | undefined {
    if (value == null) {
        return value as null | undefined;
    }

    return func(value);
}

export function roundToHour(value: Date, minute: number): Date {
    const thisHour = set(value, {
        minutes: 0,
        milliseconds: 0,
        seconds: 0,
    });

    const candidates = [thisHour, addHours(thisHour, 1)];

    return closestTo(value, candidates);
}

export function roundToMinute(value: Date, interval: number): Date {
    const thisHour = set(value, {
        minutes: 0,
        milliseconds: 0,
        seconds: 0,
    });
    const nextHour = addHours(thisHour, 1);
    const candidates = [thisHour];

    for (let d = thisHour; d <= nextHour; d = addMinutes(d, interval)) {
        candidates.push(d);
    }

    return closestTo(value, candidates);
}
