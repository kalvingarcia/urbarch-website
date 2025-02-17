import {Children} from "react";
import {tss} from "tss-react";
import {useTheme} from "./theme";
import Carousel from "./carousel";
import {Title} from "./typography";

const useStyles = tss.create(({theme}) => ({
    results: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
    },
    divider: {
        maxWidth: "1000px",
        width: "66%",
        height: "1pt",
        opacity: 0.5,
        backgroundColor: theme.body
    }
}));

export default function Listings({children}) {
    const theme = useTheme();
    const {classes} = useStyles({theme});
    return (
        <div className={classes.results}>
            <Title>Results ({Children.count(children)})</Title>
            <div className={classes.divider} />
            <Carousel>
                {children}
            </Carousel>
        </div>
    );
}