export function Piece({id, name, description, customer, product}) {
    return (
        <div className="piece">
            <div>
                <span>{id}</span>
            </div>
        </div>
    );
}

export default function Portfolio({children}) {
    return (
        <section className="portfolio">
            {children}
        </section>
    );
}