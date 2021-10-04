import { add as addDate, format, sub as subDate } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { fromTimezoned, parseDate, parseTime, toTimezoned } from "../util/date";

export interface DateInputProps {
    value?: Date;
    disabled?: boolean;
    title?: string;

    timezone?: string;

    coerce?(value: Date): void;
    onValueChange?(value: Date): void;
}

const FORMAT_STYLE = "PP";

const ERROR_INPUT_CSS = css`
    outline: medium red solid;
`;

const Input = styled.input<{ error?: boolean }>`
    ${p => p.error && ERROR_INPUT_CSS}
    font-size: 14pt;
`;

export default function DateInput(props: DateInputProps): JSX.Element {
    const { value, onValueChange, disabled, timezone, title } = props;
    const myValue = useMemo(() => value ?? new Date(), [value]);
    const tzValue = useMemo(() => toTimezoned(myValue, timezone), [myValue, timezone]);

    const [raw, setRaw] = useState(() => {
        if (value == null) return "";
        return format(tzValue, FORMAT_STYLE);
    });

    const error = useMemo(() => {
        const parsed = parseDate(raw, tzValue);
        if (parsed == null) {
            return "Unable to parse date.";
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

        let scaleYears = 0;
        let scaleMonths = 0;
        let scaleDays = 0;
        if (e.ctrlKey && e.shiftKey) {
            scaleYears = 1;
        } else if (e.ctrlKey || e.shiftKey) {
            scaleMonths = 1;
        } else {
            scaleDays = 1;
        }

        if (e.key === "ArrowUp") {
            const newValue = addDate(myValue, {
                days: scaleDays,
                months: scaleMonths,
                years: scaleYears,
            });
            onValueChange?.(newValue);
            return;
        }

        if (e.key === "ArrowDown") {
            const newValue = subDate(myValue, {
                days: scaleDays,
                months: scaleMonths,
                years: scaleYears,
            });
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
