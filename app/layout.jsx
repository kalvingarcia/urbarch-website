import Local from 'next/font/local';
import {Roboto, Cinzel} from 'next/font/google';
import Theme from './assets/components/theme';
import Header from './assets/components/header';
import Footer from './assets/components/footer';
import './assets/styles/global.scss';
import MessageHandler from './assets/components/message-handler';

const univers = Local({
    variable: "--univers",
    src: [
        {
            path: './assets/fonts/univers/UniversLight.otf',
            weight: '300',
            style: 'normal'
        },
        {
            path: './assets/fonts/univers/UniversLightOblique.otf',
            weight: '300',
            style: 'oblique'
        },
        {
            path: './assets/fonts/univers/UniversRoman.otf',
            weight: '400',
            style: 'normal'
        },
        {
            path: './assets/fonts/univers/UniversRomanOblique.otf',
            weight: '400',
            style: 'oblique'
        },
        {
            path: './assets/fonts/univers/UniversBold.otf',
            weight: '700',
            style: 'normal'
        },
        {
            path: './assets/fonts/univers/UniversBoldOblique.otf',
            weight: '700',
            style: 'oblique'
        },
        {
            path: './assets/fonts/univers/UniversBlack.otf',
            weight: '800',
            style: 'normal'
        },
        {
            path: './assets/fonts/univers/UniversBlackOblique.otf',
            weight: '800',
            style: 'oblique'
        },
        {
            path: './assets/fonts/univers/UniversExtraBlack.otf',
            weight: '900',
            style: 'normal'
        },
        {
            path: './assets/fonts/univers/UniversExtraBlackOblique.otf',
            weight: '900',
            style: 'oblique'
        }
    ]
});

const trajan = Local({
    variable: "--trajan",
    src: [
        {
            path: './assets/fonts/trajan/TrajanExtraLight.otf',
            weight: '200',
            style: 'normal'
        },
        {
            path: './assets/fonts/trajan/TrajanLight.otf',
            weight: '300',
            style: 'normal'
        },
        {
            path: './assets/fonts/trajan/TrajanExtraLight.otf',
            weight: '200',
            style: 'normal'
        },
        {
            path: './assets/fonts/trajan/TrajanRegular.otf',
            weight: '400',
            style: 'normal'
        },
        {
            path: './assets/fonts/trajan/TrajanSemibold.otf',
            weight: '600',
            style: 'normal'
        },
        {
            path: './assets/fonts/trajan/TrajanBold.otf',
            weight: '700',
            style: 'normal'
        },
        {
            path: './assets/fonts/trajan/TrajanBlack.otf',
            weight: '800',
            style: 'normal'
        }
    ]
});

const material_icons = Local({
    variable: "--material-icons",
    src: [
        {
            path: './assets/fonts/icons//MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].woff2',
            weight: '400',
            style: 'normal'
        }
    ]
});

const urban_icons = Local({
    variable: "--urban-icons",
    src: [{
        path: './assets/fonts/icons/UrbanIcons.woff',
        weight: '400',
        style: 'normal'
    }]
});

export const metadata = {
    title: 'Urban Archaeology',
    description: 'The online catalog for the historic, salvage-inspired furnishing company.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${univers.variable} ${trajan.variable} ${material_icons.variable} ${urban_icons.variable}`}>
            <body>
                <MessageHandler>
                    <Theme>
                        <Header />
                        {children}
                        <Footer />
                    </Theme>
                </MessageHandler>
            </body>
        </html>
    )
}