import Title from "./title";
import "../assets/styles/components/featured.scss";

export default function Featured({children}) {
    return (
        <section className="featured">
            <Title className="title">Featured Products</Title>
            <div className="divider" />
            <div className="cards">
                {children}
            </div>
        </section>
    );
}