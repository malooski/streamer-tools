import { faGithubSquare, faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { HashRouter as Router, Link, Route, Switch, Redirect } from "react-router-dom";
import styled from "styled-components";
import ReactivePngPage from "./pages/ReactivePngPage";
import TimezonesPage from "./pages/TimezonesPage";

const RootDiv = styled.div``;

const NavDiv = styled.div`
    width: 500px;
    margin: 0 auto;
    justify-self: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

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
                    <Link to="/reactive">Reactive PNG</Link>
                </NavDiv>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/timezones" />
                    </Route>
                    <Route path="/timezones">
                        <TimezonesPage />
                    </Route>
                    <Route path="/reactive">
                        <ReactivePngPage />
                    </Route>
                </Switch>
            </RootDiv>
        </Router>
    );
}

export default App;
