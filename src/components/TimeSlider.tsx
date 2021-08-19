import { format } from "date-fns/esm";
import React from "react";
import styled from "styled-components";

export interface TimeSliderProps {
    value: Date;
    onValueChange?(date: Date): void;
}

const NIGHT_COLOR = "#040c24";
const MORNING_COLOR = "#ff950a";
const DAY_COLOR = "#b0e9ff";
const EVENING_COLOR = "#a83bd3";

const SUN_UP_HOUR = 6;
const SUN_DOWN_HOUR = 8 + 12;

const RootDiv = styled.div`
    height: 2em;

    background-image: linear-gradient(
        to right,
        ${NIGHT_COLOR} 10%,
        ${MORNING_COLOR} 20%,
        ${DAY_COLOR} 40% 70%,
        ${EVENING_COLOR} 90%,
        ${NIGHT_COLOR}
    );

    text-align: center;
    color: black;
`;

export default function TimeSlider(props: TimeSliderProps) {
    const text = format(props.value, "p");

    return <RootDiv>{text}</RootDiv>;
}
