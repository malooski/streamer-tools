import { faGithubSquare, faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import DiscordTimestampPage from "./pages/DiscordTimestampPage";
import SandboxPage from "./pages/SandboxPage";
import TimezonesPage from "./pages/TimezonesPage";

const RootDiv = styled.div``;

const NavDiv = styled.div`
    width: 500px;
    margin: 0 auto;
    justify-self: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin-top: 1em;
    margin-bottom: 1em;
`;

const AboutMeHeader = styled.div`
    margin: 12px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 14pt;
`;

function App() {
    return (
        <Router>
            <RootDiv>
                <AboutMeHeader>
                    <div>
                        Streamer Tools by <strong>Malooski</strong>
                    </div>

                    <a href="https://twitter.com/malooskii" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon size="lg" icon={faTwitterSquare} />
                    </a>

                    <a
                        href="https://github.com/malooski/streamer-tools"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon size="lg" icon={faGithubSquare} />
                    </a>
                </AboutMeHeader>
                <NavDiv>
                    <Link to="/timezones">Timezones</Link>
                    <Link to="/discord">Discord Timestamp</Link>
                    <Link to="/sandbox">Sandbox</Link>
                </NavDiv>
                <Switch>
                    <Route path="/timezones">
                        <TimezonesPage />
                    </Route>
                    <Route path="/discord">
                        <DiscordTimestampPage />
                    </Route>
                    <Route path="/sandbox">
                        <SandboxPage />
                    </Route>
                </Switch>
            </RootDiv>
        </Router>
    );
}

export default App;
