import Banner from "../assets/components/banner"
import {Display} from "../assets/components/typography"
import CatalogBody from "../assets/components/catalog-body"

export default function Catalog() {
    return (
        <main>
            <Banner src="catalog.jpg">
                <Display size="medium">Catalog</Display>
            </Banner>
            <CatalogBody />
        </main>
    )
}