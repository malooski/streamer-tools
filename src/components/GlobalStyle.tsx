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

    h1, h2, h3, h4, h5, h6, p {
        padding: 0;
        margin: 0;
    }

    a {
        color: ${COLOR.lightBlue}
    }
`;
