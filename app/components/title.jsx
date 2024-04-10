import '../assets/styles/components/title.scss';

export default function Title({children}) {
    return (
        <h1 className='title'>{children}</h1>
    );
}