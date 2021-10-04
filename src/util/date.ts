import { addHours, addMinutes, closestTo, isValid, parse, set } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

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

export function parseTime(raw: string, refDate: Date): Date | null {
    // 12:42 pm, "12 pm", "13"
    const formats = [
        "h:m a", // 12:42 pm
        "h:ma", // 12:42pm

        "H:m", // 13:42

        "h a", // 12 pm
        "ha", // 12pm

        "H", // 13
    ];

    for (const format of formats) {
        try {
            const parsedDate = parse(raw, format, refDate);
            if (isValid(parsedDate)) {
                return parsedDate;
            }
        } catch (e) {
            continue;
        }
    }

    return null;
}

export function parseDate(raw: string, refDate: Date): Date | null {
    const formats = ["P", "PP", "PPP", "PPPP"];

    for (const format of formats) {
        try {
            const parsedDate = parse(raw, format, refDate);
            if (isValid(parsedDate)) {
                return parsedDate;
            }
        } catch (e) {
            continue;
        }
    }

    return null;
}

export function toTimezoned(date: Date, timezone?: string | null | undefined): Date {
    if (timezone == null) return date;
    return utcToZonedTime(date, timezone);
}

export function fromTimezoned(date: Date, timezone?: string | null | undefined): Date {
    if (timezone == null) return date;
    return zonedTimeToUtc(date, timezone);
}
