import React, { useState } from "react";
import styled from "styled-components";
import { MaybeLink } from "../components/MaybeLink";
import TimeInput from "../components/TimeInput";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    justify-self: center;
`;

const NewFriendDiv = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 4pt 8pt;
`;

const FriendsDiv = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 4pt 8pt;
`;

interface Friend {
    name: string;
    link?: string;
    timezone: string;
}

const COMMON_TIMEZONES = [
    { name: "US/Pacific", timezone: "US/Pacific" },
    { name: "US/Eastern", timezone: "US/Eastern" },
    { name: "US/Mountian", timezone: "US/Mountian" },
    { name: "US/Central", timezone: "US/Central" },

    { name: "Japan", timezone: "Japan" },
    { name: "Europe/London", timezone: "Europe/London" },
    { name: "Europe/Berlin", timezone: "Europe/Berlin" },
];

export default function TimezonesPage() {
    const [refTime, setRefTime] = useState(new Date());
    const [friends] = useState<Friend[]>([]);

    return (
        <RootDiv>
            <label>Your Time</label>
            <TimeInput value={refTime} onValueChange={setRefTime} />

            <h3>New Friend</h3>

            <NewFriendDiv>
                <label>Name</label>
                <input type="text"></input>

                <label>Link</label>
                <input type="text"></input>

                <label>Timezone</label>
                <input type="integer"></input>
            </NewFriendDiv>

            <h3>Common</h3>
            <FriendsDiv>
                <div>Name</div>
                <div>Local Time</div>

                {COMMON_TIMEZONES.map(f => renderFriend(f))}
            </FriendsDiv>

            <h3>Friends</h3>
            <FriendsDiv>
                <div>Name</div>
                <div>Local Time</div>

                {friends.map(f => renderFriend(f))}
            </FriendsDiv>
        </RootDiv>
    );

    function renderFriend(friend: Friend) {
        return (
            <React.Fragment>
                <MaybeLink href={friend.link} text={friend.name} />
                <TimeInput timezone={friend.timezone} value={refTime} onValueChange={setRefTime} />
            </React.Fragment>
        );
    }
}
