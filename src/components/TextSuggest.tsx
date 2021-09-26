import React, { useMemo } from "react";
import styled from "styled-components";
import { useUuid } from "../util/react";

export interface TextSuggestProps {
    value?: string;
    placeholder?: string;
    suggestions?: string[];

    onValueChange?(value: string): void;
}

const Input = styled.input``;

export function TextSuggest(props: TextSuggestProps) {
    const { value, placeholder, suggestions, onValueChange } = props;
    const mySuggestions = useMemo(() => suggestions ?? [], [suggestions]);

    const myId = useUuid();
    const listName = React.useMemo(() => `textsuggest-list-${myId}`, [myId]);

    return (
        <React.Fragment>
            <Input
                value={value}
                placeholder={placeholder ?? mySuggestions[0]}
                type="text"
                onChange={onInputChange}
                list={listName}
            ></Input>
            <datalist id={listName}>
                {mySuggestions.map(s => (
                    <option value={s} />
                ))}
            </datalist>
        </React.Fragment>
    );

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        onValueChange?.(e.target.value);
    }
}
