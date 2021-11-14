import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Set as ImSet } from "immutable";
import { toggleImSet } from "../util/immutable";

const PAGE_WIDTH = 800;

const RootDiv = styled.div`
    display: grid;
    margin: 0px auto 300px auto;
    gap: 16px;

    grid-template-columns: 1fr;
    width: ${PAGE_WIDTH}px;
    justify-self: center;
`;

enum LinkTag {
    VTUBING,
    STREAMING,
    AFTER_EFFECTS,
    STREAM_ASSETS,
    UTILITIES,
}

const LINK_TAGS: LinkTag[] = [
    LinkTag.VTUBING,
    LinkTag.STREAMING,
    LinkTag.AFTER_EFFECTS,
    LinkTag.STREAM_ASSETS,
    LinkTag.UTILITIES,
];

interface LinkTagInfo {
    name: string;
    description?: string;
}

interface LinkTagBadgeProps {
    tag: LinkTag;
}

const LINK_TAG_CSS = css`
    font-size: 0.6em;
    padding: 0.5em;
    border-radius: 1em;
    border: 1px solid black;
    background-color: #7a7a7a;
    color: white;
`;

const LinkTagBadgeSpan = styled.span`
    ${LINK_TAG_CSS}
`;

function LinkTagBadge(props: LinkTagBadgeProps) {
    const { tag } = props;

    const name = LINK_TAG_INFO[props.tag].name;
    const description = LINK_TAG_INFO[tag].description;

    return <LinkTagBadgeSpan title={description}>{name}</LinkTagBadgeSpan>;
}

const MyLinkTagBadgeButton = styled.button<{ active?: boolean }>`
    ${LINK_TAG_CSS}

    ${props => props.active && "background-color: #2eb3ff;"}

    &:hover {
        background-color: #a0a0a0;
        ${props => props.active && "background-color: #146da0;"}
    }
`;

interface LinkTagBadgeButtonProps extends LinkTagBadgeProps {
    active?: boolean;
    onClick?(): void;
}

function LinkTagBadgeButton(props: LinkTagBadgeButtonProps) {
    const { tag, onClick, active } = props;

    const name = LINK_TAG_INFO[props.tag].name;
    const description = LINK_TAG_INFO[tag].description;

    return (
        <MyLinkTagBadgeButton active={active} onClick={onClick} title={description}>
            {name}
        </MyLinkTagBadgeButton>
    );
}

const LINK_TAG_INFO: Record<LinkTag, LinkTagInfo> = {
    [LinkTag.VTUBING]: {
        name: "VTubing",
    },
    [LinkTag.STREAMING]: {
        name: "Streaming",
    },
    [LinkTag.AFTER_EFFECTS]: {
        name: "AfterEffects",
        description: "After Effects",
    },
    [LinkTag.STREAM_ASSETS]: {
        name: "Stream Assets",
        description: "Stream Assets",
    },
    [LinkTag.UTILITIES]: {
        name: "Utilities",
        description: "General tools & utilities to make the computer experience better.",
    },
};

interface LinkInfo {
    title: string;
    link: string;
    creator?: string;
    creatorLink?: string;
    description?: string;
    cost?: string;
    tags?: LinkTag[];
    featured?: boolean;
}

const LINK_INFOS: LinkInfo[] = [
    {
        title: "Detonate",
        description: "40 FREE Explosion SFX and VFX Elements",
        creator: "Premium Beat",
        link: "https://www.premiumbeat.com/blog/free-explosion-sfx-vfx-elements/",
    },
    {
        title: "VSeeFace",
        description:
            "VSeeFace is a free, highly configurable face and hand tracking VRM and VSFAvatar avatar puppeteering program for virtual youtubers with a focus on robust tracking and high image quality.",
        creator: "Emiliana_vt",
        link: "https://www.vseeface.icu/",
        tags: [LinkTag.VTUBING],
    },
    {
        title: "GifGun",
        description:
            "With easy 1-click workflow, Alpha channel support, Batch Render and GIF compression, GifGun is the go-to tool for making GIFs in Adobe After Effects.",
        creator: "extrabyte",
        link: "https://extrabite.io/gifgun",
        cost: "$29.99",
        tags: [LinkTag.AFTER_EFFECTS],
    },
    {
        title: "Stream Avatars",
        link: "https://streamavatars.com/",
        description:
            "Stream Avatars connects with your Twitch, Facebook, Youtube, Trovo, or Dlive to add flair to your live broadcast, it also promotes viewer interaction and channel growth.",
        cost: "$14.99",
    },
    {
        title: "Spooky's Stream Assets",
        description: "Many free stream transitions, stingers, alert, music packs, and more!",
        link: "https://ko-fi.com/spvwvky/shop",
        creator: "@Spvwvky",
        creatorLink: "https://twitter.com/Spvwvky",
        tags: [LinkTag.STREAM_ASSETS],
    },
    {
        title: "MochiMochiAlice's Stream Assets",
        description: "Stream schedules, info panels, and more!",
        link: "https://mochimochialice.gumroad.com/",
        creator: "@mochimochialice",
        creatorLink: "https://twitter.com/mochimochialice",
        tags: [LinkTag.STREAM_ASSETS],
    },
    {
        title: "Malooski's Stream Assets",
        description: "Video overlays and more!",
        link: "https://malooski.gumroad.com/",
        creator: "Malooski",
        creatorLink: "https://twitter.com/malooskii",
        tags: [LinkTag.STREAM_ASSETS],
    },
    {
        title: "ShareX",
        description:
            "ShareX is a free and open source program that lets you capture or record any area of your screen and share it with a single press of a key. It also allows uploading images, text or other types of files to many supported destinations you can choose from.",
        link: "https://getsharex.com/",
        tags: [LinkTag.UTILITIES],
    },
    {
        title: "Discord StreamKit Overlay",
        description:
            "Discord's new OBS Streamkit Overlay is an awesomely-customizable additional browser source to depict your voice / text chat activity while in game. This will help you display vital server information to your viewers without using up valuable stream real estate for the whole client.",
        link: "https://streamkit.discord.com/overlay",
        tags: [LinkTag.STREAMING],
    },
];

const LinksArea = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1em;
`;

const TagsFilterArea = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.2em;
`;

export default function UsefulLinksPage() {
    const [tagsFilter, setTagsFilter] = useState<ImSet<LinkTag>>(ImSet());
    const [freeFilter, setFreeFilter] = useState(false);

    const filteredLinks = useMemo(() => {
        let filteredLinks = LINK_INFOS;

        if (tagsFilter.size > 0) {
            filteredLinks = filteredLinks.filter(link => {
                return tagsFilter.intersect(link.tags ?? []).size > 0;
            });
        }

        if (freeFilter) {
            filteredLinks = filteredLinks.filter(link => {
                return link.cost == null;
            });
        }

        return filteredLinks;
    }, [tagsFilter, freeFilter]);

    const anyFiltersActive = tagsFilter.size > 0 || freeFilter;

    return (
        <RootDiv>
            <h1>Useful Links</h1>

            <h3>Filters</h3>

            <TagsFilterArea>
                <MyLinkTagBadgeButton active={freeFilter} onClick={() => setFreeFilter(p => !p)}>
                    FREE
                </MyLinkTagBadgeButton>

                {LINK_TAGS.map(t => (
                    <LinkTagBadgeButton
                        active={tagsFilter.has(t)}
                        onClick={() => setTagsFilter(p => toggleImSet(p, t))}
                        tag={t}
                    />
                ))}
                <MyLinkTagBadgeButton active={anyFiltersActive} onClick={() => clearFilters()}>
                    Clear Filters
                </MyLinkTagBadgeButton>
            </TagsFilterArea>
            <LinksArea>
                {filteredLinks.map(link => (
                    <LinkEntry info={link} />
                ))}
            </LinksArea>
        </RootDiv>
    );

    function clearFilters() {
        setTagsFilter(p => p.clear());
        setFreeFilter(false);
    }
}

const LinkEntryDiv = styled.div`
    display: flex;
    flex-direction: column;

    gap: 0.5em;

    padding: 0.5em;
    border-radius: 1em;
    border: 1px solid #ccc;
    background-color: #fafafa;
    color: #333;
`;

const LinkEntryHeader = styled.div`
    display: grid;

    gap: 0.5em;

    grid-template:
        "title creator cost link" auto /
        auto auto 1fr auto;

    align-items: baseline;
`;

const LinkEntryTitle = styled.h2`
    grid-area: title;
`;

const LinkEntryCreator = styled.a`
    grid-area: creator;
`;

const LinkEntryLinkOut = styled.a`
    grid-area: link;

    padding: 0.3em 0.6em;
    background-color: #3783e7;
    border-radius: 0.5em;
    color: white;
    text-decoration: none;
`;

const LinkEntryDescription = styled.div`
    grid-area: desc;

    padding: 0.5em;
    background-color: #f0f0f0;
    border-radius: 1em;
    border: 1px solid #ccc;
`;

const LinkEntryCost = styled.span`
    grid-area: cost;

    justify-self: end;
    color: green;
`;

const LinkEntryTagArea = styled.div`
    display: flex;
    flex-direction: row;
`;

function LinkEntry(props: { info: LinkInfo }) {
    const { info } = props;
    const tags = info.tags ?? [];

    return (
        <LinkEntryDiv>
            <LinkEntryHeader>
                <LinkEntryTitle>{info.title}</LinkEntryTitle>
                <LinkEntryCreator href={info.creatorLink}>{info.creator}</LinkEntryCreator>
                {info.cost != null && <LinkEntryCost>{info.cost}</LinkEntryCost>}
                <LinkEntryLinkOut href={info.link} rel="noreferrer" target="_blank">
                    Go
                </LinkEntryLinkOut>
            </LinkEntryHeader>
            {tags.length > 0 && (
                <LinkEntryTagArea>
                    {tags.map(tag => (
                        <LinkTagBadge tag={tag} />
                    ))}
                </LinkEntryTagArea>
            )}
            {info.description != null && (
                <LinkEntryDescription>{info.description}</LinkEntryDescription>
            )}
        </LinkEntryDiv>
    );
}
