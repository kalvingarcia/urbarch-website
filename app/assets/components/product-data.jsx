"use client"
import Image from 'next/image';
import {useCallback, useContext, useState} from 'react';
import {Heading, Subheading, Subtitle, Title} from './typography';
import Button from './button';
import DropdownMenu from './dropdown-menu';
import '../styles/components/metadata.scss';
import Modal from './modal';
import Icon from './icon-comp';
import {GET_PRODUCT_CUTSHEET} from '../../api';
import {MessageContext} from './message-handler';

export default function ProductData({product, extension, drawing}) {
    const {triggerInfoMessage, triggerErrorMessage} = useContext(MessageContext);

    const variation = product.variations.find(variation => variation.extension === extension);
    
    const minOption = variation.finishes.reduce((min, {display, value}) => min.value < value? min : {display, value}, Infinity);
    const [price, updatePrice] = useState(minOption.value);

    const openPDF = useCallback(() => {
        triggerInfoMessage("Generating PDF!");
        (async () => {
            const uri = await fetch(
                `${GET_PRODUCT_CUTSHEET}?id=${product.id}&extension=${variation.extension}`,
                {cache: 'no-store'}
            ).then(response => {
                if(!response.ok)
                    throw new Error("Couldn't generate PDF.");
                return response.text()
            }).catch(error => triggerErrorMessage(error.message));
            if(uri) {
                var download = document.createElement('a');
                download.setAttribute('href', uri);
                download.setAttribute('download', 
                    `${product.name}${variation.subname !== ""? ` [${variation.subname}]` : ""} Cutsheet - ${(new Date()).toLocaleDateString(
                        undefined, {year: 'numeric', month: 'short', day: 'numeric'})}.pdf`
                );
                download.style.display = 'none';

                document.body.appendChild(download);
                download.click();
                document.body.removeChild(download);
                triggerInfoMessage("PDF download initiated!")
            }
        })();
    }, []);

    const [open, setOpen] = useState(false);
    return (
        <div className='metadata'>
            <div className='general'>
                <div className='title'>
                    <Title>{product.name}</Title>
                    {variation.subname !== ""? <Subtitle>{variation.subname}</Subtitle> : ""}
                </div>
                <span className='id'>{product.id}{extension !== "NONE"? "-" + extension : ""}</span>
                <div className='price'>
                    <span className='current'>{price.toString() === "Infinity"? "Call for pricing" : `$${price.toLocaleString('en', {useGrouping: true})}.00`}</span>
                    {price !== minOption.value?
                        <span className='base'>(Starting at ${minOption.value.toLocaleString('en', {useGrouping: true})})</span>
                        :
                        ""
                    }
                </div>
                <p className='description'>{product.description}</p>
                <div className='buttons'>
                    <Button role="primary" style="filled" onPress={() => setOpen(true)}>Product Details</Button>
                    <Icon appearance="text" button icon="picture_as_pdf" onPress={() => openPDF()} />
                </div>
            </div>
            {variation.finishes.length > 1?
                <div className='options'>
                    <Heading>Finishes</Heading>
                    <DropdownMenu options={variation.finishes} defaultOption={minOption} onChange={updatePrice} />
                </div>
                :
                ""
            }
            <Modal open={open} setOpen={setOpen}>
                <div className='metadata-overview'>
                    <div className='drawing'>
                        <Heading>Drawing</Heading>
                        <Image src={drawing} alt="" />
                    </div>
                    <div className='miscellaneous'>
                        <Heading>Overview</Heading>
                        {variation.overview.specifications &&
                            <div className='specifications'>
                                <Subheading>Specifications</Subheading>
                                {variation.overview.specifications.width && <span>Width: {variation.overview.specifications.width.measurement} {variation.overview.specifications.width.unit}</span>}
                                {variation.overview.specifications.projection && <span>Projection: {variation.overview.specifications.projection.measurement} {variation.overview.specifications.projection.unit}</span>}
                                {variation.overview.specifications.height && <span>Height: {variation.overview.specifications.height.measurement} {variation.overview.specifications.height.unit}</span>}
                                {variation.overview.specifications.weight && <span>Weight: {variation.overview.specifications.weight.measurement} {variation.overview.specifications.weight.unit}</span>}
                            </div>
                        }
                        {variation.overview.ul &&
                            <div className='ul-info'>
                                <Subheading>UL Listing</Subheading>
                                <span>This product is listed for use in {variation.overview.ul?.[0].toUpperCase()} environments.</span>
                            </div>
                        }
                        {variation.overview.bulbs?.length > 0?
                            <div className='bulb-info'>
                                <Subheading>Bulb Information</Subheading>
                                <span>{variation.overview.bulb.shape.name} Bulb ({variation.overview.bulb.shape.code}) {variation.overview.bulb.socket.name} Base ({variation.overview.bulb.socket.code})</span> 
                                <span>{variation.overview.bulb.specifications} recommended</span>
                                <span>({variation.overview.bulb.quantity} count)</span>
                            </div>
                            :
                            ""
                        }
                        {variation.overview.notes?? "" !== ""?
                            <div className='notes'>
                                <Subheading>Notes</Subheading>
                                <pre className='text'>{variation.overview.notes}</pre>
                            </div> 
                            :
                            ""
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}