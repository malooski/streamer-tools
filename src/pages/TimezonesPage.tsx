import React, { useState } from "react";
import styled from "styled-components";
import { MaybeLink } from "../components/MaybeLink";
import TimeInput from "../components/TimeInput";
import { filterIdx } from "../util";
import { useLocalStorage, useSimpleForm } from "../util/react";

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

const CommonDiv = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 4pt 8pt;
`;

const FriendsDiv = styled.div`
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    grid-gap: 4pt 8pt;
`;

interface TimezoneEntry {
    name: string;
    link?: string;
    timezone: string;
}

const COMMON_TIMEZONES: TimezoneEntry[] = [
    { name: "US/Pacific", timezone: "US/Pacific" },
    { name: "US/Eastern", timezone: "US/Eastern" },
    { name: "US/Central", timezone: "US/Central" },

    { name: "Japan", timezone: "Japan" },
    { name: "Europe/London", timezone: "Europe/London" },
    { name: "Europe/Berlin", timezone: "Europe/Berlin" },
];

const INITIAL_FRIENDS: TimezoneEntry[] = [
    { name: "Malooski", link: "https://twitter.com/malooskii", timezone: "US/Central" },
];

const FRIENDS_KEY = "STREAMER_TOOLS_TIMEZONE_FREINDS";

export default function TimezonesPage() {
    const [refTime, setRefTime] = useState(new Date());
    const [friends, setFriends] = useLocalStorage<TimezoneEntry[]>(FRIENDS_KEY, INITIAL_FRIENDS);

    const [newFriend, setNewFriend] = useSimpleForm({
        name: "",
        link: "",
        timezone: "",
    });

    return (
        <RootDiv>
            <label>Your Time</label>
            <TimeInput value={refTime} onValueChange={setRefTime} />

            <h3>Common</h3>
            <CommonDiv>
                <div>Timezone</div>
                <div>Local Time</div>

                {COMMON_TIMEZONES.map(f => renderCommon(f))}
            </CommonDiv>

            <h3>New Friend</h3>
            <NewFriendDiv>
                <label>Name</label>
                <input
                    value={newFriend.name}
                    onChange={e => setNewFriend({ name: e.target.value })}
                    type="text"
                ></input>

                <label>Link</label>
                <input
                    type="text"
                    value={newFriend.link}
                    onChange={e => setNewFriend({ link: e.target.value })}
                ></input>

                <label>Timezone</label>
                <input
                    type="text"
                    value={newFriend.timezone}
                    onChange={e => setNewFriend({ timezone: e.target.value })}
                ></input>
            </NewFriendDiv>
            <button onClick={onAddFriend}>Add Friend</button>

            <h3>Friends</h3>
            <FriendsDiv>
                <div>Name</div>
                <div>Timezone</div>
                <div>Local Time</div>
                <div />

                {friends.map((f, idx) => renderFriend(f, idx))}
            </FriendsDiv>
        </RootDiv>
    );

    function onAddFriend() {
        setFriends(f => [
            ...f,
            {
                name: newFriend.name,
                link: newFriend.link || undefined,
                timezone: newFriend.timezone,
            },
        ]);
        setNewFriend({
            name: "",
            link: "",
            timezone: "",
        });
    }

    function renderCommon(friend: TimezoneEntry) {
        return (
            <React.Fragment>
                <MaybeLink href={friend.link} text={friend.name} />
                <TimeInput timezone={friend.timezone} value={refTime} onValueChange={setRefTime} />
            </React.Fragment>
        );
    }

    function renderFriend(friend: TimezoneEntry, idx: number) {
        return (
            <React.Fragment>
                <MaybeLink href={friend.link} text={friend.name} />
                <span>{friend.timezone}</span>
                <TimeInput timezone={friend.timezone} value={refTime} onValueChange={setRefTime} />
                <button onClick={() => setFriends(f => filterIdx(f, idx))}>X</button>
            </React.Fragment>
        );
    }
}
