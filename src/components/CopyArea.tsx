import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

export interface CopyAreaProps {
    value?: string;
}

const RootDiv = styled.div`
    position: relative;
`;

const MyTextArea = styled.textarea`
    resize: none;
    width: 100%;
    height: fit-content;

    background-color: #bdbdbd; ;
`;

const MyCopyButton = styled.button`
    position: absolute;
    padding: 8px;
    font-weight: bold;

    box-shadow: 0px 0px 16px rgba(1, 0, 0, 0.5);

    width: 128px;

    color: white;
    background-color: #0088ff;
    border-radius: 8px;
    border: white solid 1px;

    right: 16px;
    top: 16px;
`;

export default function CopyArea(props: CopyAreaProps) {
    const [copied, setCopied] = useState(false);

    const { value } = props;

    const rows = useMemo(() => value?.split("\n")?.length ?? 0, [value]);

    useEffect(() => {
        setCopied(false);
    }, [value]);

    const onCopyClick = useCallback(() => {
        navigator.clipboard.writeText(value ?? "");
        setCopied(true);
    }, [value]);

    return (
        <RootDiv>
            <MyCopyButton onClick={onCopyClick}>{copied ? "Copied!" : "Copy"}</MyCopyButton>
            <MyTextArea value={value} readOnly draggable={false} rows={rows + 5} />
        </RootDiv>
    );
}
