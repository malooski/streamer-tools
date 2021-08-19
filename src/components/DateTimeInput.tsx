import { format, parse } from "date-fns";
import React from "react";
import styled from "styled-components";

interface CommonDateTimeInputProps {
    disabled?: boolean;
}

interface NullableDateTimeInputProps extends CommonDateTimeInputProps {
    value?: Date | null | undefined;
    nulllable?: false;
    onValueChange?(value: Date | null): void;
}

interface RequiredDateTimeInputProps extends CommonDateTimeInputProps {
    value: Date;
    nulllable: true;
    onValueChange?(value: Date): void;
}

const EditButton = styled.button`
    height: 60px;
    border: 1px solid grey;
    border-radius: 12px;
`;

const RootDiv = styled.div`
    height: 60px;
    display: grid;
    grid-template:
        "now-button time-label date-label cancel-button submit-button" auto
        "now-button time-input date-input cancel-button submit-button" 1fr / auto 1fr 1fr auto auto;

    .time-input {
        grid-area: time-input;
    }

    .date-input {
        grid-area: date-input;
    }
`;

const TimeLabel = styled.label`
    grid-area: time-label;
    border-top: 1px solid grey;
`;

const DateLabel = styled.label`
    grid-area: date-label;
    border-top: 1px solid grey;
`;

const CancelButton = styled.button`
    grid-area: cancel-button;
    border: 1px solid grey;
    padding: 8px;
    border-radius: 0px;
    background-color: #af4040;
    color: white;
`;

const SubmitButton = styled.button`
    grid-area: submit-button;
    border: 1px solid grey;
    padding: 8px;
    background-color: #57a357;
    color: white;
    border-radius: 0px 12px 12px 0px;
`;

const NowButton = styled.button`
    grid-area: now-button;
    border: 1px solid grey;
    padding: 8px;
    border-radius: 12px 0px 0px 12px;
`;

export type DateTimeInputProps = NullableDateTimeInputProps | RequiredDateTimeInputProps;

export default function DateTimeInput(props: DateTimeInputProps) {
    const [rawTimeValue, setRawTimeValue] = React.useState<string>("");
    const [rawDateValue, setRawDateValue] = React.useState<string>("");
    const [refDate, setRefDate] = React.useState(new Date());
    const [isEditing, setIsEditing] = React.useState(false);

    if (!isEditing) {
        const text = props.value == null ? "No date selected." : format(props.value, "p - PPP");
        return <EditButton onClick={onStartEditing}>{text}</EditButton>;
    }

    return (
        <RootDiv>
            <NowButton onClick={onSetNow}>Now</NowButton>
            <TimeLabel>Time</TimeLabel>
            <input
                className="time-input"
                type="time"
                value={rawTimeValue}
                onChange={onTimeChange}
            ></input>
            <DateLabel>Date</DateLabel>
            <input
                className="date-input"
                type="date"
                value={rawDateValue}
                onChange={onDateChange}
            ></input>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
            <SubmitButton onClick={onSubmit}>Okay</SubmitButton>
        </RootDiv>
    );

    function onStartEditing() {
        setIsEditing(true);
        setRefDate(props.value ?? new Date());

        if (props.value == null) {
            setRawTimeValue("");
            setRawDateValue("");
        } else {
            setRawTimeValue(getTimeInputValue(props.value));
            setRawDateValue(getDateInputValue(props.value));
        }
    }

    function onTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRawTimeValue(e.target.value);
    }

    function onDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRawDateValue(e.target.value);
    }

    function onCancel() {
        setIsEditing(false);
    }

    function onSetNow() {
        const now = new Date();
        setRawTimeValue(getTimeInputValue(now));
        setRawDateValue(getDateInputValue(now));
    }

    function onSubmit() {
        let newDate = refDate;
        newDate = parse(rawDateValue, "yyyy-MM-dd", newDate);
        newDate = parse(rawTimeValue, "kk:mm", newDate);

        props.onValueChange?.(newDate);
        setIsEditing(false);
    }
}

function getTimeInputValue(date: Date): string {
    return format(date, "kk:mm");
}

function getDateInputValue(date: Date): string {
    return format(date, "yyyy-MM-dd");
}
