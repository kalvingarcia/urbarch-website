import {redirect} from 'next/navigation';

export default function Product({params: {product: [id, extension, ...rest]}}) {
    if(rest.length > 0)
        redirect(`/catalog/${id}/${extension}`);

    

    return(
        <div>{`${id} ${extension}`}</div>
    )
}