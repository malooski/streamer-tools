import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import styled from "styled-components";
import CopyButton from "../components/CopyButton";
import Select, { SelectOption } from "../components/Select";
import DateTimeInput from "../components/DateTimeInput";
import { useState } from "../hooks";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    justify-self: center;

    * {
        margin-bottom: 8px;
    }
`;

export default function DiscordTimestampPage() {
    const curDate = useState(new Date());
    const formatOptions: SelectOption<string>[] = [
        { value: "t", text: `Short Time - ${format(curDate.value, "HH:mm")}`, key: "t" },
        { value: "T", text: `Long Time - ${format(curDate.value, "HH:mm:ss")}`, key: "T" },

        { value: "d", text: `Short Date - ${format(curDate.value, "dd/MM/yyyy")}`, key: "d" },
        { value: "D", text: `Long Date - ${format(curDate.value, "dd MMMM yyyy")}`, key: "D" },

        {
            value: "f",
            text: `Short Date/Time - ${format(curDate.value, "dd MMMM yyyy HH:mm")}`,
            key: "f",
        },
        {
            value: "F",
            text: `Long Date/Time - ${format(curDate.value, "iiii, dd MMMM yyyy HH:mm")}`,
            key: "F",
        },

        { value: "R", text: `Relative Time - ${formatDistanceToNow(curDate.value)}`, key: "R" },
    ];

    const selectedFormat = useState(formatOptions[2].value);

    const formattedMessage = React.useMemo(() => {
        return `<t:${curDate.value.valueOf()}:${selectedFormat.value}>`;
    }, [curDate.value, selectedFormat.value]);

    return (
        <RootDiv>
            <DateTimeInput value={curDate.value} onValueChange={curDate.set} />

            <Select
                value={selectedFormat.value}
                options={formatOptions}
                onValueChange={selectedFormat.set}
            />

            <CopyButton showData data={formattedMessage} />
        </RootDiv>
    );
}
