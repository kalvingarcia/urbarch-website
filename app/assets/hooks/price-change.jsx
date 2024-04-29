"use client"
import { useCallback, useState } from "react";

export default function usePriceChange(basePrice) {
    const [price, setPrice] = useState(basePrice);

    const onPriceChange = useCallback(difference => {
        setPrice(price + difference);
    }, [price]);
    
    return [price, onPriceChange]
}