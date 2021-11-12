import {
    addMonths,
    addYears,
    format,
    isSameDay,
    isSameMonth,
    set as setDateParts,
    subMonths,
    subYears,
} from "date-fns";
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns/esm";
import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { COLOR } from "./constants";
import { FlexRow } from "./div";

export interface CalendarInputProps {
    value: Date;
    onValueChange?(value: Date): void;
}

const RootDiv = styled.div``;

const HeaderDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const CalendarDiv = styled.div`
    display: grid;

    align-items: stretch;

    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 32px);
`;

const CAL_BTN_RADIUS = "8px";
const CalNavButton = styled.button`
    border-radius: ${CAL_BTN_RADIUS} ${CAL_BTN_RADIUS} 0px 0px;
`;
const CalNavButtonGroup = styled.div`
    display: flex;
    flex-direction: row;

    ${CalNavButton}:first-child {
        border-radius: ${CAL_BTN_RADIUS} 0px 0px 0px;
    }

    ${CalNavButton}:last-child {
        border-radius: 0px ${CAL_BTN_RADIUS} 0px 0px;
    }
`;

const WeekdayDiv = styled.div`
    text-align: center;
    align-self: flex-end;
`;

export default function CalendarInput(props: CalendarInputProps) {
    const { value } = props;

    const [focused, setFocused] = React.useState(value);

    const headerText = format(focused, "MMM yyyy");

    const calStart = startOfWeek(startOfMonth(focused));
    const calEnd = endOfWeek(endOfMonth(focused));

    const daysInCal = eachDayOfInterval({
        start: calStart,
        end: calEnd,
    });

    return (
        <RootDiv>
            <HeaderDiv>
                <CalNavButtonGroup>
                    <CalNavButton onClick={onPrevYear} title="Previous Year">
                        &lt;&lt;
                    </CalNavButton>
                    <CalNavButton onClick={onPrevMonth} title="Previous Month">
                        &lt;
                    </CalNavButton>
                </CalNavButtonGroup>
                <div>{headerText}</div>
                <FlexRow>
                    <CalNavButtonGroup style={{ marginRight: 8 }}>
                        <CalNavButton onClick={onReturn} title="Go To Selected">
                            Return
                        </CalNavButton>
                        <CalNavButton onClick={onToday} title="Go To Today">
                            Today
                        </CalNavButton>
                    </CalNavButtonGroup>
                    <CalNavButtonGroup>
                        <CalNavButton onClick={onNextMonth} title="Next Month">
                            &gt;
                        </CalNavButton>
                        <CalNavButton onClick={onNextYear} title="Next Year">
                            &gt;&gt;
                        </CalNavButton>
                    </CalNavButtonGroup>
                </FlexRow>
            </HeaderDiv>

            <CalendarDiv>
                <WeekdayDiv>Sun</WeekdayDiv>
                <WeekdayDiv>Mon</WeekdayDiv>
                <WeekdayDiv>Tue</WeekdayDiv>
                <WeekdayDiv>Wed</WeekdayDiv>
                <WeekdayDiv>Thu</WeekdayDiv>
                <WeekdayDiv>Fri</WeekdayDiv>
                <WeekdayDiv>Sat</WeekdayDiv>

                {daysInCal.map(d => (
                    <CalDayButton
                        key={d.getTime()}
                        value={props.value}
                        current={d}
                        focused={focused}
                        onClick={() => onDayClick(d)}
                    />
                ))}
            </CalendarDiv>
        </RootDiv>
    );

    function onDayClick(date: Date) {
        const newDate = setDateParts(date, {
            hours: value.getHours(),
            milliseconds: value.getMilliseconds(),
            minutes: value.getMinutes(),
            seconds: value.getSeconds(),
        });
        setFocused(newDate);
        props.onValueChange?.(newDate);
    }

    function onPrevYear() {
        setFocused(subYears(focused, 1));
    }

    function onPrevMonth() {
        setFocused(subMonths(focused, 1));
    }

    function onReturn() {
        setFocused(props.value);
    }

    function onToday() {
        const today = setDateParts(new Date(), {
            hours: value.getHours(),
            milliseconds: value.getMilliseconds(),
            minutes: value.getMinutes(),
            seconds: value.getSeconds(),
        });
        setFocused(today);
    }

    function onNextMonth() {
        setFocused(addMonths(focused, 1));
    }

    function onNextYear() {
        setFocused(addYears(focused, 1));
    }
}

const FOCUSED_BORDER_SIZE = "3px";

const ACTIVE_CAL_DAY = css`
    border: ${FOCUSED_BORDER_SIZE} ${COLOR.white} solid;
    background-color: ${COLOR.lightBlue};
    color: white;
`;
const FOCUSED_CAL_DAY = css`
    border: ${FOCUSED_BORDER_SIZE} ${COLOR.lightBlue} solid;
`;
const OUT_MONTH_CAL_DAY = css`
    background-color: ${COLOR.black};
    color: ${COLOR.white};
`;

const CalDayBtn = styled.button<{ active?: boolean; focused?: boolean; outMonth?: boolean }>`
    border: 1px grey solid;

    :hover {
        background-color: ${COLOR.darkBlue};
        color: ${COLOR.white};
    }

    ${p => p.active && ACTIVE_CAL_DAY};
    ${p => p.focused && FOCUSED_CAL_DAY};
    ${p => p.outMonth && OUT_MONTH_CAL_DAY};
`;

interface CalDayButtonProps {
    current: Date;
    value: Date;
    focused: Date;
    onClick?(): void;
}

const CalDayButton = React.memo((props: CalDayButtonProps) => {
    const { current, value, focused } = props;

    const title = useMemo(() => format(current, "PPPP"), [current]);
    const text = useMemo(() => format(current, "d"), [current]);

    const isActive = useMemo(() => isSameDay(current, value), [current, value]);
    const isFocused = useMemo(() => isSameDay(current, focused), [current, focused]);
    const isWithinMonth = useMemo(() => isSameMonth(current, focused), [current, focused]);

    return (
        <CalDayBtn
            title={title}
            active={isActive}
            focused={isFocused}
            outMonth={!isWithinMonth}
            onClick={props.onClick}
        >
            {text}
        </CalDayBtn>
    );
});
