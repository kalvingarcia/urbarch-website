import Hero from './assets/components/hero';
import {Display} from './assets/components/typography';
import Button from './assets/components/button';
import Featured from './assets/components/featured';
import Banner from './assets/components/banner';
import {GET_FEATURED_PRODUCTS} from './api';

export default async function Home() {
    const featured = await fetch(GET_FEATURED_PRODUCTS, {cache: 'no-store'}).then(response => response.json());
    return (
        <main>
            <Hero src="home.jpg">
                <Display size="medium" style={{fontFamily: "var(--trajan)"}}>An Exploration of</Display>
                <Display>urban <span style={{fontFamily: "var(--trajan)"}}>ARCHAEOLOGY</span></Display>
                <Display size="small">May 16th-17th and 20th-23rd </Display>
                <Display size="small">@ 7:00 AM - 4:00 PM</Display>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdL1pVylvGkvPjGTv31c1-C0y_04Xfp3KzbrWaPNWAe2u-SJg/viewform"><Button role="secondary" style="outlined">RSVP Here!</Button></a>
            </Hero>
            <Featured featured={featured} changeWidth={1000} home />
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