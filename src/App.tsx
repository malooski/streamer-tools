import React from "react";

import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import DiscordTimestampPage from "./pages/DiscordTimestampPage";
import SandboxPage from "./pages/SandboxPage";
import TimezonesPage from "./pages/TimezonesPage";

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

function App() {
    return (
        <Router>
            <NavDiv>
                <Link to="/">Home</Link>
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
        </Router>
    );
}

export default App;
