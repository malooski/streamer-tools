import { format, addMinutes, subMinutes } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { parseTime } from "../util/date";

export interface TimeInputProps {
    value?: Date;
    disabled?: boolean;
    title?: string;

    timezone?: string;

    coerce?(value: Date): void;
    onValueChange?(value: Date): void;
}

const FORMAT_STYLE = "hh:mm a";

const ERROR_INPUT_CSS = css`
    outline: medium red solid;
`;

const Input = styled.input<{ error?: boolean }>`
    ${p => p.error && ERROR_INPUT_CSS}
    font-size: 14pt;
`;

export default function TimeInput(props: TimeInputProps): JSX.Element {
    const { value, onValueChange, disabled, timezone, title } = props;
    const myValue = useMemo(() => value ?? new Date(), [value]);
    const tzValue = useMemo(() => toTimezoned(myValue, timezone), [myValue, timezone]);

    const [raw, setRaw] = useState(() => {
        if (value == null) return "";
        return format(tzValue, FORMAT_STYLE);
    });

    const error = useMemo(() => {
        const parsed = parseTime(raw, tzValue);
        if (parsed == null) {
            console.log("bad");
            return "Unable to parse time.";
        }
        return null;
    }, [raw, tzValue]);

    useEffect(() => {
        setRaw(format(tzValue, FORMAT_STYLE));
    }, [tzValue]);

    const placeholder = format(toTimezoned(new Date(), timezone), FORMAT_STYLE);

    return (
        <Input
            error={error != null}
            title={error ?? title}
            placeholder={placeholder}
            type="text"
            value={raw}
            disabled={disabled}
            onChange={onInputChange}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyDown}
        ></Input>
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

function toTimezoned(date: Date, timezone?: string | null | undefined): Date {
    if (timezone == null) return date;
    return utcToZonedTime(date, timezone);
}

function fromTimezoned(date: Date, timezone?: string | null | undefined): Date {
    if (timezone == null) return date;
    return zonedTimeToUtc(date, timezone);
}
