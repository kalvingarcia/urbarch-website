"use client"
import {Heading} from "./typography";

export default function Related({id, extension}) {
    return (
        <section className="related">
            <Heading>Related Products</Heading>
            <div className="products">
            </div>
        </section>
    );
}