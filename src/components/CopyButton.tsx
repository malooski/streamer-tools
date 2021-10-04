import React from "react";
import styled from "styled-components";

export interface CopyButtonProps {
    data?: string;
    showData?: boolean;
    onCopied?(data: string): void;
}

const RootDiv = styled.div`
    display: grid;
    grid-template: "ro-input copy-button" 1fr / 1fr auto;
`;

const InnerCopyButton = styled.button`
    grid-area: copy-button;
    padding: 8px;
    border-radius: 0px 8px 8px 0px;
    border: 1px solid grey;
    font-weight: bold;
`;

const ReadOnlyInput = styled.input`
    grid-area: ro-input;
    border: 1px solid grey;
    border-radius: 8px 0px 0px 8px;
    padding-left: 8px;

    background-color: white;
    color: black;
`;

export default function CopyButton(props: CopyButtonProps) {
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        // Reset copied flag on data change.
        setCopied(false);
    }, [props.data]);

    return (
        <RootDiv>
            <ReadOnlyInput disabled value={props.data} />
            <InnerCopyButton onClick={onClick}>{copied ? "Copied!" : "Copy"}</InnerCopyButton>
        </RootDiv>
    );

    function onClick() {
        if (props.data == null) return;

        setCopied(true);

        window.navigator.clipboard.writeText(props.data);
        props.onCopied?.(props.data);
    }
}
