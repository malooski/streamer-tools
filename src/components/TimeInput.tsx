import { format, isValid, parse, addMinutes, subMinutes } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import React, { useEffect, useMemo, useState } from "react";

export interface TimeInputProps {
    value?: Date;
    disabled?: boolean;

    min?: Date;
    max?: Date;

    timezone?: string;

    coerce?(value: Date): void;
    onValueChange?(value: Date): void;
}

const FORMAT_STYLE = "hh:mm a";

export default function TimeInput(props: TimeInputProps): JSX.Element {
    const { value, onValueChange, disabled, timezone } = props;
    const myValue = useMemo(() => value ?? new Date(), [value]);
    const tzValue = useMemo(() => toTimezoned(myValue, timezone), [myValue, timezone]);

    const [raw, setRaw] = useState(() => {
        if (value == null) return "";
        return format(tzValue, FORMAT_STYLE);
    });

    useEffect(() => {
        setRaw(format(tzValue, FORMAT_STYLE));
    }, [tzValue]);

    const placeholder = format(toTimezoned(new Date(), timezone), FORMAT_STYLE);

    return (
        <input
            placeholder={placeholder}
            type="datetime"
            value={raw}
            disabled={disabled}
            onChange={onInputChange}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyDown}
        ></input>
    );

    function onInputChange(e: React.FormEvent<HTMLInputElement>) {
        if (disabled) return;

        const newRaw = e.currentTarget.value;
        setRaw(newRaw);
    }

    function onInputBlur() {
        if (disabled) return;
        submit();
    }

    function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (disabled) return;

        if (e.key === "Enter") {
            submit();
            return;
        }

        if (e.key === "Escape") {
            cancel();
            return;
        }

        let incScale = 1;
        if (e.ctrlKey && e.shiftKey) {
            incScale = 60;
        } else if (e.ctrlKey || e.shiftKey) {
            incScale = 10;
        }

        if (e.key === "ArrowUp") {
            const newValue = addMinutes(myValue, incScale);
            onValueChange?.(newValue);
            return;
        }

        if (e.key === "ArrowDown") {
            const newValue = subMinutes(myValue, incScale);
            onValueChange?.(newValue);
            return;
        }
    }

    function cancel() {
        setRaw(format(tzValue, FORMAT_STYLE));
    }

    function submit() {
        const newValue = parseTime(raw, tzValue);
        if (newValue == null) return;
        const newTzValue = fromTimezoned(newValue, timezone);
        onValueChange?.(newTzValue);
    }
}

function parseTime(raw: string, refDate: Date): Date | null {
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

function toTimezoned(date: Date, timezone?: string | null | undefined): Date {
    if (timezone == null) return date;
    return utcToZonedTime(date, timezone);
}

function fromTimezoned(date: Date, timezone?: string | null | undefined): Date {
    if (timezone == null) return date;
    return zonedTimeToUtc(date, timezone);
}
