import { useCallback } from "react"

export default function TextInput({name, onChange}) {
    const handleChange = useCallback(event => {
        onChange(event.target.value);
    }, []);

    return (
        <input name={name} onChange={handleChange} />
    )
}