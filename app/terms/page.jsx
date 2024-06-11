import Banner from "../assets/components/banner";
import {Display, Heading, Subheading} from "../assets/components/typography";
import '../assets/styles/pages/terms.scss'

export default function Terms() {
    return (
        <main className="terms">
            <Banner src="terms.jpg">
                <Display size="medium">Terms and Conditions</Display>
            </Banner>
            <div className="info">
                <Heading>Orders and Billing</Heading>
                <p>
                    Orders may be placed by mail, phone, fax, or by sending us an email. If you do not see what you are looking for on this website,
                    we are able to customize new pieces to meet your specifications. Please contact us for details.
                </p>
                <Subheading>Payment</Subheading>
                <p>
                    Urban Archaeology accepts cash, checks, money orders, wire transfers, Visa, MasterCard, American Express, and Discover Card.
                    Payments made by a credit card will receive a 3.5% credit card surcharge fee. A minimum deposit of 50% is required to start
                    all orders with the balance due prior to pick-up or delivery. Some items require payment in full; please consult a sales associate.
                    Credit card payments canceled after the initial day of purchase are subject to a 4% processing fee. This fee is charged by the credit
                    card processing company and cannot be waived.
                </p>
                <Subheading>Sales Tax</Subheading>
                <p>
                    Sales tax will be applied to orders shipped to, or picked up in, Connecticut, Illinois, Massachusetts, New Jersey, and New York. Orders
                    shipped out of these states are not subject to sales tax. If applicable, a Resale Certificate must be presented at the time the order is
                    placed. Shipments abroad that are picked up at a store will require a Bill of Lading to be tax exempt.
                </p>
                <Subheading>Rush Orders</Subheading>
                <p>
                    There is a 25% up-charge to rush an order. Rush orders must be paid in full at the time the order is placed. Rush orders cannot be cancelled,
                    returned, or refunded. Some items cannot be rushed; please ask your sales associate for details.
                </p>
                <Heading>Shipping and Handling</Heading>
                <p>
                    Prices do not include shipping and handling or special packaging fees. Small orders are typically shipped UPS or FedEx and large orders via
                    common carrier. Some items may require an additional fee for crating. A sales associate will provide an estimate for shipping and any additional
                    fees at the time the order is placed. In the event that the actual cost of shipping exceeds the estimate, the remaining balance will be
                    added to the invoice and will be due upon receipt.
                </p>
                <Subheading>Lead Times</Subheading>
                <p>
                    Lead times are an estimate and are not guaranteed. Orders will be shipped or made available for pick-up when they are complete and paid in full.
                    Items held may incur a storage fee.
                </p>
                <Subheading>Deliveries</Subheading>
                <p>
                    Crated orders are sidewalk delivery only, unless otherwise arranged. Unpacking, set up, placement and removal of packing material for sidewalk
                    delivery is recipient's responsibility.
                </p>
                <Heading>Returns, Exchanges, and Cancellations</Heading>
                <p>
                    Orders may not be returned, cancelled, or exchanged without prior authorization. Authorized returns must be made within 14 days of receipt
                    and a store credit will be issued. Materials must be in original packaging. A restocking fee plus return shipping charges will be applied.
                    Custom orders cannot be returned. Urban Archaeology standard metal finishes include: polished brass, polished chrome, and polished nickel.
                    All other metal finishes offered are custom. All hanging light, washstand, tile and stone orders are built or made to your specifications
                    and cannot be returned.
                </p>
                <Subheading>Claims</Subheading>
                <p>
                    Inspect all materials immediately. Claims for damage, defects, or shortage must be in writing and made within three days upon receipt.
                    All cartons, crates, and packing materials must be kept for inspection or the claim will not be honored. Installation constitutes acceptance.
                </p>
                <Heading>Installation and Care</Heading>
                <p>
                    Follow any instructions provided with the shipment. Use a licensed and experienced installer. Please do not make final arrangements for
                    installation until all materials have been received and inspected. Urban Archaeology is not responsible for installation.
                </p>
                <Subheading>Metal Finishes</Subheading>
                <p>
                    Our metal finishes are living finishes. Although regular maintenance will prolong the original appearance, this will not guarantee that the finish
                    will remain unchanged over time. A change in finish is accelerated when a product is installed outside. Many finishes are hand applied and may appear
                    different than the fixture viewed in showrooms, on a sample or on the internet.
                </p>
                <Subheading>Variation</Subheading>
                <p>
                    Tile and stone are products of nature. Inherent to these materials is some degree of variation. Materials received may differ in shading and/or veining
                    from samples viewed in showrooms. Obtain a strike-off or sample of current lot prior to placing an order.
                </p>
                <Heading>Disclaimer</Heading>
                <p>
                    All information represented on our orders is accurate at the time of printing. Prices and availability are subject to change without notice. Every Sales
                    Order issued requires a signed copy of the document on file to advance an order into production. Errors and ommisions excepted.
                </p>
            </div>
        </main>
    );
}