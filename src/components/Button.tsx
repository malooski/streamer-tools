import styled from "styled-components";
import { COLOR } from "./constants";

export default styled.button`
    border-radius: 1em;

    border: 1px solid ${COLOR.blue};
    color: ${COLOR.blue};
    padding: 4px 8px;

    :hover {
        background-color: ${COLOR.blue};
        color: ${COLOR.white};
    }
`;
