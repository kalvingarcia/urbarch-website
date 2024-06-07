"use client"
import { createPortal } from "react-dom";
import Card from "./card";
import { Heading, Subheading } from "./typography";
import { useEffect, useState } from "react";
import Image from "next/image";
import '../styles/components/portfolio.scss';
import Modal from "./modal";

function PieceSkeleton() {
    return (
        <div className="piece skeleton">
            landscape
        </div>
    );
}

export function Piece({id, name, description, customer, product}) {
    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");
    useEffect(() => {
        (async () => {
            setLoading(true);
            setImage(await import(`../images/customs/${id}/gallery.jpg`));
            setLoading(false);
        })();
    }, [id]);

    return (loading?
        <PieceSkeleton />
        :
        <>
            <div className="piece" onClick={() => setOpen(true)}>
                <Image src={image} alt="" />
            </div>
            <Modal open={open} setOpen={setOpen}>
                <div className="piece-metadata">
                    <Heading>{name}</Heading>
                    <div className="description">
                        <Subheading>Description</Subheading>
                        <span>{description}</span>
                    </div>
                    {customer !== ""?
                        <div  className="customer">
                            <Subheading>Customer</Subheading>
                            <span>{customer}</span>
                        </div>
                        :
                        ""
                    }
                    {product?
                        <div className="product">
                            <Subheading>Product</Subheading>
                            <span>This custom product was based on this product:</span>
                            <Card type="list" from="products" {...product} />
                        </div>
                        :
                        ""
                    }
                </div>
            </Modal>
        </>
    );
}

export default function Portfolio({children}) {
    return (
        <section className="portfolio">
            {children}
        </section>
    );
}