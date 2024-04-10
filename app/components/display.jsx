import '../assets/styles/components/display.scss';

export default function Display({size = "large", style, children}) {
    return (
        <h1 className={['display', size].join(" ")} style={style}>{children}</h1>
    );
}