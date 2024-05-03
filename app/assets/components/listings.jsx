import Carousel from "./carousel";
import '../styles/components/listings.scss';
import { Title } from "./typography";

export default function Listings({children}) {
    return (
        <div className="results">
            <Title>Results</Title>
            <div className="divider" />
            <Carousel>
                {children}
            </Carousel>
        </div>
    );
}