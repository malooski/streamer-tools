export interface MaybeLinkProps {
    text: string;
    href?: string;
}

export function MaybeLink(props: MaybeLinkProps) {
    const { text, href } = props;
    if (href == null) {
        return <span>{text}</span>;
    } else {
        return (
            <a href={href} target="_blank" rel="noreferrer">
                {text}
            </a>
        );
    }
}
