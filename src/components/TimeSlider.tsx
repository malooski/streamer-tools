import { eachHourOfInterval, startOfDay } from "date-fns";
import { addSeconds, endOfDay, format } from "date-fns/esm";
import React from "react";
import styled from "styled-components";
import { mapValue } from "../util";

export interface TimeSliderProps {
    value: Date;
    onValueChange?(date: Date): void;
}

const RootDiv = styled.div`
    position: relative;

    height: 4em;

    background-color: white;

    text-align: center;
    color: black;

    overflow: hidden;
`;

const HoverLine = styled.div`
    position: absolute;
    border-left: 2px solid blue;
    top: 0px;
    height: 100%;
`;

const HoverTime = styled.div`
    position: absolute;
    background-color: blue;
    color: white;
    font-size: 8pt;
    bottom: 0px;

    border-radius: 0 8px 0 0;

    padding: 2px 4px;

    user-select: none;

    white-space: nowrap;
`;

const ValueLine = styled(HoverLine)`
    border-left: 2px solid red;
`;

const ValueTime = styled(HoverTime)`
    background-color: red;
    border-radius: 0 8px 0 0;
`;

const NightDiv = styled.div`
    position: absolute;
    background-color: rgb(150, 150, 150);
    top: 0px;
    height: 100%;
`;

const TickLine = styled(HoverLine)`
    border-left: 2px solid grey;
`;

const TickTime = styled(HoverTime)`
    background-color: grey;
    top: 0px;
    bottom: unset;

    border-radius: 0 0 8px 0;

    :hover {
        z-index: 5000;
    }
`;

const MORNING_START_HOUR = 0;
const MORNING_END_HOUR = 7;
const NIGHT_START_HOUR = 8 + 12;
const NIGHT_END_HOUR = 24;

export default function TimeSlider(props: TimeSliderProps) {
    const rootRef = React.useRef<HTMLDivElement>();
    const [hoverPct, setHoverPct] = React.useState<number | null>();

    const rootWidth =
        mapValue(rootRef.current, r => {
            const bbox = r.getBoundingClientRect();
            return bbox.width;
        }) ?? 100;

    const dayStart = startOfDay(props.value);
    const dayEnd = endOfDay(props.value);

    const tickDates = eachHourOfInterval({
        start: dayStart,
        end: dayEnd,
    });

    const hoverOffset = rootWidth * (hoverPct ?? 0);
    const hoverDate = addSeconds(dayStart, 24 * 60 * 60 * (hoverPct ?? 0));
    const hoverText = format(hoverDate, "p");

    const valuePct =
        (props.value.valueOf() - dayStart.valueOf()) / (dayEnd.valueOf() - dayStart.valueOf());
    const valueOffset = valuePct * rootWidth;
    const valueText = format(props.value, "p");

    return (
        <RootDiv
            ref={onRootRef}
            onMouseMove={onMouseMove}
            onClick={onClick}
            onMouseLeave={onMouseLeave}
        >
            <NightDiv
                style={{
                    width: ((MORNING_END_HOUR - MORNING_START_HOUR) / 24) * rootWidth,
                    left: (MORNING_START_HOUR / 24) * rootWidth,
                }}
            />

            <NightDiv
                style={{
                    width: ((NIGHT_END_HOUR - NIGHT_START_HOUR) / 24) * rootWidth,
                    left: (NIGHT_START_HOUR / 24) * rootWidth,
                }}
            />

            {tickDates.map(d => renderTick(d))}

            <ValueLine style={{ left: valueOffset }} />
            <ValueTime style={{ left: valueOffset }}>{valueText}</ValueTime>

            {hoverPct && (
                <React.Fragment>
                    <HoverLine style={{ left: hoverOffset }} />
                    <HoverTime style={{ left: hoverOffset }}>{hoverText}</HoverTime>
                </React.Fragment>
            )}
        </RootDiv>
    );

    function renderTick(d: Date) {
        const pct = getPercentOfDay(props.value, d);
        const offset = pct * rootWidth;
        const text = format(d, "h");

        return (
            <React.Fragment key={d.valueOf()}>
                <TickLine style={{ left: offset }} />
                <TickTime style={{ left: offset }}>{text}</TickTime>
            </React.Fragment>
        );
    }

    function onRootRef(ref: HTMLDivElement) {
        rootRef.current = ref;
    }

    function onMouseMove(e: React.MouseEvent) {
        const rootRefCurr = rootRef.current;
        if (!rootRefCurr) return;

        const bbox = rootRefCurr.getBoundingClientRect();
        setHoverPct((e.clientX - bbox.x) / bbox.width);
    }

    function onMouseLeave(e: React.MouseEvent) {
        setHoverPct(null);
    }

    function onClick(e: React.MouseEvent) {
        const rootRefCurr = rootRef.current;
        if (!rootRefCurr) return;
        if (!hoverPct) return;

        const clickedDate = dayByPercent(props.value, hoverPct);

        props.onValueChange?.(clickedDate);
    }
}

const SECONDS_PER_DAY = 24 * 60 * 60;

function dayByPercent(date: Date, percent: number): Date {
    return addSeconds(startOfDay(date), SECONDS_PER_DAY * percent);
}

function getPercentOfDay(ref: Date, date: Date): number {
    const dayStart = startOfDay(ref);
    const dayEnd = endOfDay(ref);

    return (date.valueOf() - dayStart.valueOf()) / (dayEnd.valueOf() - dayStart.valueOf());
}
