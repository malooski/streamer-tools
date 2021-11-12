import styled from "styled-components";

export default styled.div<{ gap?: string }>`
    display: grid;
    grid-template-columns: 1fr;

    ${props => props.gap && `grid-gap: ${props.gap};`}
    justify-content: start;
    align-items: start;
    place-content: start;
`;
