import '../assets/styles/components/heading.scss';

export default function Heading({children}) {
    return (
        <h3 className='heading'>{children}</h3>
    );
}