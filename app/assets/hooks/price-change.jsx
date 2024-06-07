"use client"
import { useCallback, useEffect, useState } from "react";

export default function usePriceChange(basePrice) {
    const [price, setPrice] = useState(basePrice);
    const [choicePricings, setChoicePricings] = useState({});

    const updatePrice = useCallback((name, value) => {
        setChoicePricings({
            ...choicePricings,
            [name]: value
        });
    }, [choicePricings]);

    useEffect(() => {
        setPrice(basePrice + Object.values(choicePricings).reduce((sum, value) => sum + value, 0));
    }, [choicePricings]);

    console.log(choicePricings);

    return [price, updatePrice];
}