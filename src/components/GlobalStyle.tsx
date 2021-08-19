import { createGlobalStyle } from "styled-components";
import { COLOR } from "./constants";

export default createGlobalStyle`
    html, body {
        margin: 0;
        font-family: "Nunito", sans-serif;
        height: 100%;

        background-color: ${COLOR.black};
        color: ${COLOR.white};
    }

    a {
        color: ${COLOR.lightBlue}
    }
`;
