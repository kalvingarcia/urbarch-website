import {Heading} from "./typography";
import '../styles/components/related.scss';

export default function Related({alone = false, children}) {
    return (
        <section className={["related", alone? "alone" : ""].join(" ")}>
            <Heading>Related Products</Heading>
            <div className="cards">
                {children}
            </div>
        </section>
    );
}