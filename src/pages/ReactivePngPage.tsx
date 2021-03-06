import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import ColumnDiv from "../components/ColDiv";
import CopyArea from "../components/CopyArea";

const PAGE_WIDTH = 800;

const RootDiv = styled.div`
    display: grid;
    margin: 0px auto 300px auto;
    gap: 16px;

    grid-template-columns: 1fr;
    width: ${PAGE_WIDTH}px;
    justify-self: center;

    p {
        margin: 0;
        padding: 0;
    }

    ol,
    ul {
        margin-top: 0;
        padding-top: 0;
    }
`;

const SpacedOl = styled.ol`
    li {
        margin-bottom: 16px;
    }
`;

const SpacedUl = styled.ul`
    li {
        margin-bottom: 16px;
    }
`;

const InputGrid = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 16px;
    padding: 16px 0px;
`;

const DEFAULT_USER_ID = "168501066969645056";
const DEFAULT_CLOSED_URL =
    "https://cdn.discordapp.com/attachments/815712417208074260/825813085963943946/png-closed.png";
const DEFAULT_OPEN_URL =
    "https://cdn.discordapp.com/attachments/815712417208074260/825813089436958720/png-open.png";

const UrlPreviewImg = styled.img`
    max-width: ${PAGE_WIDTH}px;
    max-height: ${Math.floor((PAGE_WIDTH * 16) / 9)}px;
    border: 1px solid #ccc;
`;

export default function ReactivePngPage() {
    const [userId, setUserId] = useState(DEFAULT_USER_ID);
    const [closedUrl, setClosedUrl] = useState(DEFAULT_CLOSED_URL);
    const [openUrl, setOpenUrl] = useState(DEFAULT_OPEN_URL);
    const [closedBrightness, setClosedBrightness] = useState(50);
    const [openBrightness, setOpenBrightness] = useState(100);
    const [jumpHeight, setJumpHeight] = useState(10);

    const ref = useRef<HTMLUListElement | null>(null);

    const reactiveCss = useMemo(
        () =>
            getReactivePngCss({
                userId,
                closedUrl,
                openUrl,
                closedBrightness,
                openBrightness,
                jumpHeight,
            }),
        [userId, closedUrl, openUrl, closedBrightness, openBrightness, jumpHeight]
    );

    if (ref.current) {
        const r = ref.current;
        r.style.cssText = reactiveCss;
    }

    return (
        <RootDiv>
            <h1>Reactive PNG Generator</h1>

            <h3>How to use</h3>
            <SpacedOl>
                <li>
                    Create a new <strong>browser source</strong> in OBS
                </li>
                <li>
                    Get the Discord Voice Widget URL for the new source.
                    <ol>
                        <li>
                            Go to{" "}
                            <a href="https://streamkit.discord.com/overlay">
                                Discord StreamKit Overlay
                            </a>
                            .
                        </li>
                        <li>
                            Click the <strong>Voice Widget</strong> tab.
                        </li>
                        <li>Select the Server and voice channel you want to use.</li>
                        <li>
                            Enable <strong>Hide Names</strong>.
                        </li>
                        <li>Copy the URL into the browser source's URL</li>
                    </ol>
                </li>
                <li>Fill out the fields below to get the custom CSS.</li>
            </SpacedOl>

            <h3>Tips</h3>
            <SpacedUl>
                <li>Use the same resolution between Open and Closed PNGs.</li>
                <li>Make the resolution no larger than 1080p.</li>
                <li>
                    <strong>Upload your PNGs to a dedicated PNG channel on Discord.</strong>
                    <br />
                    You can copy the URL from discord and it'll always available.
                </li>
                <li>
                    <strong>Save the custom CSS in your dedicated PNG channel.</strong>
                    <br />
                    It can be used regaurdless of server and can be shared with other.
                </li>
                <li>Enable Discord's developer mode to easily copy a User ID</li>
            </SpacedUl>

            <ColumnDiv>
                <h3>General Properties</h3>
                <InputGrid>
                    <label>User ID</label>
                    <input
                        placeholder="168501066969645056"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        onFocus={selectOnFocus}
                    ></input>
                </InputGrid>
            </ColumnDiv>

            <ColumnDiv>
                <h3>Closed Properties</h3>
                <InputGrid>
                    <label>Closed URL</label>
                    <input
                        placeholder="https://i.imgur.com/XqQZQ.png"
                        value={closedUrl}
                        onChange={e => setClosedUrl(e.target.value)}
                        onFocus={selectOnFocus}
                    ></input>
                    <label>Closed Brightness</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={closedBrightness}
                        onChange={e => setClosedBrightness(e.target.valueAsNumber)}
                    />
                    <label>Open URL</label>
                    <input
                        placeholder="https://i.imgur.com/XqQZQ.png"
                        value={openUrl}
                        onChange={e => setOpenUrl(e.target.value)}
                        onFocus={selectOnFocus}
                    ></input>
                </InputGrid>
                <UrlPreviewImg
                    style={{
                        filter: `brightness(${closedBrightness}%)`,
                    }}
                    src={closedUrl}
                />
            </ColumnDiv>

            <ColumnDiv>
                <h3>Open Properties</h3>
                <InputGrid>
                    <label>Open URL</label>
                    <input
                        placeholder="https://i.imgur.com/XqQZQ.png"
                        value={closedUrl}
                        onChange={e => setOpenUrl(e.target.value)}
                        onFocus={selectOnFocus}
                    ></input>
                    <label>Open Brightness</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={openBrightness}
                        onChange={e => setOpenBrightness(e.target.valueAsNumber)}
                    />
                    <label>Jump Height</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={jumpHeight}
                        onChange={e => setJumpHeight(e.target.valueAsNumber)}
                    />
                </InputGrid>

                <UrlPreviewImg
                    style={{
                        filter: `brightness(${openBrightness}%)`,
                    }}
                    src={openUrl}
                />
            </ColumnDiv>

            <ColumnDiv></ColumnDiv>

            <ColumnDiv>
                <label>
                    <h3>Output CSS </h3>
                    (Copy this into your browser source)
                </label>
                <CopyArea value={reactiveCss} />
            </ColumnDiv>
        </RootDiv>
    );
}

interface ReactivePngCssProps {
    userId: string;
    closedUrl: string;
    openUrl: string;
    closedBrightness: number;
    openBrightness: number;
    jumpHeight: number;
}

function getReactivePngCss(props: ReactivePngCssProps): string {
    const userId = props.userId.trim();
    const closedBrightness = Math.round(props.closedBrightness);
    const openBrightness = Math.round(props.openBrightness);
    const jumpHeight = Math.round(props.jumpHeight);

    return `
li.voice-state:not([data-reactid*="${userId}"]) { display:none; }

.avatar {
    content:url(${props.closedUrl});
    height:auto !important;
    width:auto !important;
    border-radius:0% !important;
    filter: brightness(${closedBrightness}%);
}

.speaking {
    border-color:rgba(0,0,0,0) !important;
    position:relative;
    animation-name: speak-now;
    animation-duration: 1s;
    animation-fill-mode:forwards;
    filter: brightness(${openBrightness}%);
    content:url(${props.openUrl});
}
 
@keyframes speak-now {
    0% { bottom:0px; }
    15% { bottom:${jumpHeight}px; }
    30% { bottom:0px; }
}

li.voice-state{ position: static; }
div.user{ position: absolute; left:40%; bottom:5%; }

body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
    `.trim();
}

function selectOnFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.select();
}
