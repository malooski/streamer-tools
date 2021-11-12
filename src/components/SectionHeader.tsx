import styled from "styled-components";

export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: JSX.Element;
}

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5em;
`;

const TopArea = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const MainTitle = styled.h1``;

const SubTitle = styled.p`
    font-style: italic;
    font-size: 0.8em;
    padding: 0;
    margin: 0;
`;

const IconArea = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;

    margin-right: 0.5em;

    vertical-align: middle;

    svg {
        height: 1.5em;
    }
`;

export default function SectionHeader(props: SectionHeaderProps) {
    const { title, subtitle, icon } = props;

    return (
        <RootDiv>
            <TopArea>
                {icon != null && <IconArea>{icon}</IconArea>}
                <MainTitle>{title}</MainTitle>
            </TopArea>
            {subtitle && <SubTitle>{subtitle}</SubTitle>}
        </RootDiv>
    );
}
