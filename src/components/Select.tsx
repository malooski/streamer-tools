import React from "react";

export interface SelectOption<T> {
    value: T;
    text: string;
    key: string | number;
}

interface BaseSelectProps<T> {
    placeholder?: string;
    nullable?: boolean;
    disabled?: boolean;
    options: SelectOption<T>[];
}

interface NullableSelectProps<T> extends BaseSelectProps<T> {
    value: T;
    nullable: true;

    onValueChange?(value: T): void;
}

interface RequiredSelectProps<T> extends BaseSelectProps<T> {
    value: T | null;
    nullable?: false;

    onValueChange?(value: T | null): void;
}

export type SelectProps<T> = NullableSelectProps<T> | RequiredSelectProps<T>;

export default function Select<T>(props: SelectProps<T>) {
    const valueIdx = props.options.findIndex(v => v.value === props.value);

    return (
        <select
            disabled={props.disabled}
            placeholder={props.placeholder}
            value={valueIdx}
            onChange={onChange}
        >
            {props.options.map((opt, idx) => (
                <option value={idx}>{opt.text}</option>
            ))}
        </select>
    );

    function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newIdx = e.target.value as any as number;
        const newValue = props.options[newIdx]?.value;
        if (newValue !== undefined) {
            props.onValueChange?.(newValue);
        }
    }
}
