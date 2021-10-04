import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faClock, faGlobe, faTrash, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import styled from "styled-components";
import CalendarInput from "../components/CalendarInput";
import CopyButton from "../components/CopyButton";
import { MaybeLink } from "../components/MaybeLink";
import Select, { SelectOption } from "../components/Select";
import { TextSuggest } from "../components/TextSuggest";
import TimeInput from "../components/TimeInput";
import { TIMEZONES } from "../timezones";
import { filterIdx } from "../util";
import { useLocalStorage, useSimpleForm } from "../util/react";

const RootDiv = styled.div`
    display: grid;
    margin: 0px auto 300px auto;
    gap: 32px;

    grid-template-columns: 1fr;
    width: 500px;
    justify-self: center;

    @media (min-width: 1200px) {
        width: 1000px;
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1700px) {
        width: 1500px;
        grid-template-columns: 1fr 1fr 1fr;
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

const Subtitle = styled.p`
    font-style: italic;
    margin-bottom: 16px;
`;

const DelFriendButton = styled.button``;

export default function TimezonesPage() {
    const [refTime, setRefTime] = useState(new Date());
    const [friends, setFriends] = useLocalStorage<TimezoneEntry[]>(FRIENDS_KEY, INITIAL_FRIENDS);

    const [newFriend, setNewFriend] = useSimpleForm({
        name: "",
        link: "",
        timezone: "",
    });

    const formatOptions: SelectOption<string>[] = React.useMemo(
        () => [
            { value: "t", text: `Short Time - ${format(refTime, "HH:mm")}`, key: "t" },
            { value: "T", text: `Long Time - ${format(refTime, "HH:mm:ss")}`, key: "T" },

            { value: "d", text: `Short Date - ${format(refTime, "dd/MM/yyyy")}`, key: "d" },
            { value: "D", text: `Long Date - ${format(refTime, "dd MMMM yyyy")}`, key: "D" },

            {
                value: "f",
                text: `Short Date/Time - ${format(refTime, "dd MMMM yyyy HH:mm")}`,
                key: "f",
            },
            {
                value: "F",
                text: `Long Date/Time - ${format(refTime, "iiii, dd MMMM yyyy HH:mm")}`,
                key: "F",
            },

            { value: "R", text: `Relative Time - ${formatDistanceToNow(refTime)}`, key: "R" },
        ],
        [refTime]
    );

    const [selectedFormat, setSelectedFormat] = useState(formatOptions[4].value);

    const formattedMessage = React.useMemo(() => {
        const epochSec = Math.floor(refTime.valueOf() / 1000);

        return `<t:${epochSec}:${selectedFormat}>`;
    }, [refTime, selectedFormat]);

    return (
        <RootDiv>
            <div>
                <h1>
                    <FontAwesomeIcon icon={faClock} /> Your Time
                </h1>
                <Subtitle>Enter a time here to see what it would be in other timezones!</Subtitle>
                <YourTimeDiv>
                    <NowButton onClick={() => setRefTime(new Date())}>Now</NowButton>
                    <TimeInput value={refTime} onValueChange={setRefTime} />
                </YourTimeDiv>
            </div>

            <div>
                <h1>
                    <FontAwesomeIcon icon={faGlobe} /> Common
                </h1>
                <Subtitle>Some timezones and their local times!</Subtitle>
                <CommonDiv>
                    <TzEntryHeader>Timezone</TzEntryHeader>
                    <TzEntryHeader>Local Time</TzEntryHeader>

                    {COMMON_TIMEZONES.map(f => renderCommon(f))}
                </CommonDiv>
            </div>

            <div>
                <h1>
                    <FontAwesomeIcon icon={faUserPlus} /> New Friend
                </h1>
                <Subtitle>Add a new friend to see them listed below.</Subtitle>
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
            </div>

            <div>
                <h1>
                    <FontAwesomeIcon icon={faUsers} /> Friends
                </h1>
                <Subtitle>See your added friends and their timezones here!</Subtitle>
                <FriendsDiv>
                    <TzEntryHeader>Name</TzEntryHeader>
                    <TzEntryHeader>Timezone</TzEntryHeader>
                    <TzEntryHeader>Local Time</TzEntryHeader>
                    <div />

                    {friends.map((f, idx) => renderFriend(f, idx))}
                </FriendsDiv>
            </div>

            <div>
                <h1>
                    <FontAwesomeIcon icon={faDiscord} /> Discord Formatting
                </h1>
                <Subtitle>
                    Generate a timestamp for Discord that will render as everyone's local time!
                </Subtitle>
                <CalendarInput value={refTime} onValueChange={v => setRefTime(v)} />

                <div style={{ margin: "16px 0" }}>
                    <h3>Select a style</h3>
                    <Select
                        value={selectedFormat}
                        options={formatOptions}
                        onValueChange={setSelectedFormat}
                    />
                </div>

                <h3>Copy this into Discord!</h3>
                <CopyButton showData data={formattedMessage} />
            </div>
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
