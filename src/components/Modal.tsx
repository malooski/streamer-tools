import React from "react";
import styled from "styled-components";

const BackdropDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    padding-top: 100px;
`;

const ModalDiv = styled.div``;

export interface ModalProps {
    open?: boolean;
    onClose?(): void;

    children: React.ReactNode[];
}

export default function Modal(props: ModalProps) {
    if (!props.open) return;

    return (
        <React.Fragment>
            <BackdropDiv>
                <ModalDiv>{props.children}</ModalDiv>
            </BackdropDiv>
        </React.Fragment>
    );
}
