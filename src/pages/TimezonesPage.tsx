import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styled from "styled-components";
import { MaybeLink } from "../components/MaybeLink";
import { TextSuggest } from "../components/TextSuggest";
import TimeInput from "../components/TimeInput";
import { TIMEZONES } from "../timezones";
import { filterIdx } from "../util";
import { useLocalStorage, useSimpleForm } from "../util/react";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    justify-self: center;

    h1 {
        margin: 32px 0px 0px 0px;
    }
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

const YourTimeDiv = styled.div`
    display: grid;
    grid-template:
        "label label label" auto
        "input input now-btn" auto /
        auto 1fr auto;

    grid-gap: 4pt 2pt;

    h1 {
        grid-area: label;
        font-weight: bold;
    }

    input {
        grid-area: input;
    }
`;

const NowButton = styled.button`
    grid-area: now-btn;
`;

const AddFriendButton = styled.button`
    margin-top: 8pt;
`;

interface TimezoneEntry {
    name: string;
    link?: string;
    timezone: string;
}

const TzEntryHeader = styled.span`
    font-weight: bold;
`;

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

const TIMEZONE_SUGGESTIONS = Object.keys(TIMEZONES);

const FRIENDS_KEY = "STREAMER_TOOLS_TIMEZONE_FREINDS";

const DelFriendButton = styled.button``;

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
            <YourTimeDiv>
                <h1>Your Time</h1>
                <NowButton onClick={() => setRefTime(new Date())}>Now</NowButton>
                <TimeInput
                    title="Enter a time here to see what it would be in other timezones!"
                    value={refTime}
                    onValueChange={setRefTime}
                />
            </YourTimeDiv>

            <h1>Common</h1>
            <CommonDiv>
                <TzEntryHeader>Timezone</TzEntryHeader>
                <TzEntryHeader>Local Time</TzEntryHeader>

                {COMMON_TIMEZONES.map(f => renderCommon(f))}
            </CommonDiv>

            <h1>New Friend</h1>
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
                <TextSuggest
                    value={newFriend.timezone}
                    suggestions={TIMEZONE_SUGGESTIONS}
                    onValueChange={v => setNewFriend({ timezone: v })}
                />
            </NewFriendDiv>
            <AddFriendButton onClick={onAddFriend}>Add Friend</AddFriendButton>

            <h1>Friends</h1>
            <FriendsDiv>
                <TzEntryHeader>Name</TzEntryHeader>
                <TzEntryHeader>Timezone</TzEntryHeader>
                <TzEntryHeader>Local Time</TzEntryHeader>
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
                <DelFriendButton onClick={() => setFriends(f => filterIdx(f, idx))}>
                    <FontAwesomeIcon icon={faTrash} />
                </DelFriendButton>
            </React.Fragment>
        );
    }
}
