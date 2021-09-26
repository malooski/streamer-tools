import { format, formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import styled from "styled-components";
import CopyButton from "../components/CopyButton";
import Select, { SelectOption } from "../components/Select";
import DateTimeInput from "../components/DateTimeInput";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    justify-self: center;
`;

export default function DiscordTimestampPage() {
    const [curDate, setCurDate] = useState(new Date());
    const formatOptions: SelectOption<string>[] = [
        { value: "t", text: `Short Time - ${format(curDate, "HH:mm")}`, key: "t" },
        { value: "T", text: `Long Time - ${format(curDate, "HH:mm:ss")}`, key: "T" },

        { value: "d", text: `Short Date - ${format(curDate, "dd/MM/yyyy")}`, key: "d" },
        { value: "D", text: `Long Date - ${format(curDate, "dd MMMM yyyy")}`, key: "D" },

        {
            value: "f",
            text: `Short Date/Time - ${format(curDate, "dd MMMM yyyy HH:mm")}`,
            key: "f",
        },
        {
            value: "F",
            text: `Long Date/Time - ${format(curDate, "iiii, dd MMMM yyyy HH:mm")}`,
            key: "F",
        },

        { value: "R", text: `Relative Time - ${formatDistanceToNow(curDate)}`, key: "R" },
    ];

    const [selectedFormat, setSelectedFormat] = useState(formatOptions[2].value);

    const formattedMessage = React.useMemo(() => {
        const epochSec = Math.floor(curDate.valueOf() / 1000);

        return `<t:${epochSec}:${selectedFormat}>`;
    }, [curDate, selectedFormat]);

    return (
        <RootDiv>
            <DateTimeInput value={curDate} nulllable onValueChange={setCurDate} />

            <Select
                value={selectedFormat}
                options={formatOptions}
                onValueChange={setSelectedFormat}
            />

            <CopyButton showData data={formattedMessage} />
        </RootDiv>
    );
}
