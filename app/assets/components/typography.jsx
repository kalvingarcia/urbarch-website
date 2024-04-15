import '../styles/components/typography.scss';

export function Display({size = "large", style, children}) {
    return (
        <h1 className={['display', size].join(" ")} style={style}>{children}</h1>
    );
}

export function Title({children}) {
    return (
        <h1 className='title'>{children}</h1>
    );
}

export function Subtitle({children}) {
    return (
        <h2 className='subtitle'>{children}</h2>
    );
}

export function Heading({children}) {
    return (
        <h3 className='heading'>{children}</h3>
    );
}

export function Subheading({children}) {
    return (
        <h4 className='subheading'>{children}</h4>
    );
}