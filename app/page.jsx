import Link from 'next/link';
import Hero from './assets/components/hero';
import {Display} from './assets/components/typography';
import Button from './assets/components/button';
import Featured from './assets/components/featured';
import Banner from './assets/components/banner';
import {GET_FEATURED_PRODUCTS} from './api';
import Construction from './assets/components/construction';

export default async function Home() {
    const featured = await fetch(GET_FEATURED_PRODUCTS, {cache: 'no-store'}).then(response => response.json());
    return (
        <main>
            <Hero src="home.jpg">
                <Display style={{fontFamily: "var(--trajan)"}}>The Banded Beacon</Display>
                <Display size="small">Let our <span style={{fontFamily: "var(--trajan)"}}>NEWEST BEACON</span> be your <span style={{fontFamily: "var(--trajan)"}}>INSPIRATION</span>.</Display>
                <Link href="/catalog/UA0777-F/SB">
                    <Button role="secondary" style="filled">See more now!</Button>
                </Link>
            </Hero>
            <Featured featured={featured} changeWidth={1000} home />
            {/* <Construction /> */}
            <Banner src="custom.png">
                <Display size="small">Making dreams come true!</Display>
                <span>If you do not see what you are looking for on this website, we are able to customize new pieces to meet your specifications.</span>
                <a href="mailto:ny@urbanarchaeology.com?cc=gil@urbanarchaeology.com&subject=Inquiry About Custom Product&body=Let us know what you're looking for!">
                    <Button role="secondary" style="outlined">Contact Us</Button>
                </a>
            </Banner>
        </main>
    );
}