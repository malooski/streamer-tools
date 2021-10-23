import { useMemo, useState } from "react";
import styled from "styled-components";
import ColumnDiv from "../components/ColDiv";
import alphaPatternUrl from "../assets/alpha.png";
import CopyArea from "../components/CopyArea";

const RootDiv = styled.div`
    display: grid;
    margin: 0px auto 300px auto;
    gap: 16px;

    grid-template-columns: 1fr;
    width: 500px;
    justify-self: center;
`;

const DEFAULT_USER_ID = "168501066969645056";
const DEFAULT_CLOSED_URL =
    "https://cdn.discordapp.com/attachments/815712417208074260/825813085963943946/png-closed.png";
const DEFAULT_OPEN_URL =
    "https://cdn.discordapp.com/attachments/815712417208074260/825813089436958720/png-open.png";

const UrlPreviewImg = styled.img`
    max-width: 500px;
    max-height: 300px;

    background-image: url(${alphaPatternUrl});
    background-repeat: repeat;
`;

export default function ReactivePngPage() {
    const [userId, setUserId] = useState(DEFAULT_USER_ID);
    const [closedUrl, setClosedUrl] = useState(DEFAULT_CLOSED_URL);
    const [openUrl, setOpenUrl] = useState(DEFAULT_OPEN_URL);

    const reactiveCss = useMemo(
        () => getReactivePngCss({ userId, closedUrl, openUrl }),
        [userId, closedUrl, openUrl]
    );

    return (
        <RootDiv>
            <h1>Reactive PNG Generator</h1>

            <ColumnDiv>
                <label>User ID</label>
                <input
                    placeholder="168501066969645056"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                ></input>
            </ColumnDiv>

            <ColumnDiv>
                <label>Closed URL</label>
                <input
                    placeholder="https://i.imgur.com/XqQZQ.png"
                    value={closedUrl}
                    onChange={e => setClosedUrl(e.target.value)}
                ></input>
                <label>Closed Preview</label>
                <UrlPreviewImg src={closedUrl} />
            </ColumnDiv>

            <ColumnDiv>
                <label>Open URL</label>
                <input
                    placeholder="https://i.imgur.com/XqQZQ.png"
                    value={openUrl}
                    onChange={e => setOpenUrl(e.target.value)}
                ></input>
                <UrlPreviewImg src={openUrl} />
            </ColumnDiv>

            <ColumnDiv>
                <label>CSS</label>
                <CopyArea value={reactiveCss} />
            </ColumnDiv>
        </RootDiv>
    );
}

interface ReactivePngCssProps {
    userId: string;
    closedUrl: string;
    openUrl: string;
}

function getReactivePngCss(props: ReactivePngCssProps): string {
    return `
li.voice-state:not([data-reactid*="${props.userId}"]) { display:none; }

.avatar {
    content:url(${props.closedUrl});
    height:auto !important;
    width:auto !important;
    border-radius:0% !important;
    filter: brightness(50%);
}

.speaking {
    border-color:rgba(0,0,0,0) !important;
    position:relative;
    animation-name: speak-now;
    animation-duration: 1s;
    animation-fill-mode:forwards;
    filter: brightness(100%);
    content:url(${props.openUrl});
}

@keyframes speak-now {
    0% { bottom:0px; }
    15% { bottom:10px; }
    30% { bottom:0px; }
}

li.voice-state{ position: static; }
div.user{ position: absolute; left:40%; bottom:5%; }

body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
    `.trim();
}
