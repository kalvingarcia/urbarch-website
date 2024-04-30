import {Heading} from "./typography";
import '../styles/components/related.scss';

export default function Related({children}) {
    return (
        <section className="related">
            <Heading>Related Products</Heading>
            <div className="cards">
                {children}
            </div>
        </section>
    );
}