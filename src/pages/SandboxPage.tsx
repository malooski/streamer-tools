import React from "react";
import styled from "styled-components";
import CalendarInput from "../components/CalendarInput";
import TimeSlider from "../components/TimeSlider";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    justify-self: center;
`;

export default function SandboxPage() {
    const [myDate, setMyDate] = React.useState(new Date());

    return (
        <RootDiv>
            <CalendarInput value={myDate} onValueChange={setMyDate} />
            <TimeSlider value={myDate} onValueChange={setMyDate} />
        </RootDiv>
    );
}
