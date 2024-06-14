"use client"
import Image from 'next/image';
import {renderToStaticMarkup} from 'react-dom/server';
import {createContext, useCallback, useEffect, useState} from 'react';
import {Heading, Subheading, Subtitle, Title} from './typography';
import Button from './button';
import DropdownMenu from './dropdown-menu';
import FinishesMenu from './finishes-menu';
import usePriceChange from '../hooks/price-change';
import '../styles/components/metadata.scss';
import Modal from './modal';
import IconButton from './icon-button';
import {GET_PRODUCT_CUTSHEET} from '../../api';

export default function ProductData({product, extension, images}) {
    const variation = product.variations.find(variation => variation.extension === extension);
    const [price, updatePrice] = usePriceChange(variation.price);

    const [choiceValues, setChoiceValues] = useState({});
    const updateChoiceValues = useCallback((optionName, choiceValue, choicePricing) => {
        choiceValues[optionName.toLowerCase()] = choiceValue;
        setChoiceValues({
            ...choiceValues
        });
        updatePrice(optionName, choicePricing);
    }, [choiceValues]);

    const openPDF = useCallback(async () => {
        const pdfURI = (await fetch(`${GET_PRODUCT_CUTSHEET}?id=${product.id}&extension=${variation.extension}`).then(response => response.text()));
        const pdf = window.open();
        pdf.document.body.style.margin = 0;
        pdf.document.body.style.overflow = "hidden";

        const object = pdf.document.createElement('object');
        object.data = pdfURI;
        object.type = "application/pdf";
        object.width = "100%";
        object.height = "100%";

        pdf.document.body.appendChild(object);
    });

    const [open, setOpen] = useState(false);
    return (
        <div className='metadata'>
            <div className='general'>
                <div className='title'>
                    <Title>{product.name}</Title>
                    {extension !== "DEFAULT"? <Subtitle>{variation.subname}</Subtitle> : ""}
                </div>
                <span className='id'>{product.id}{extension !== "DEFAULT"? "-" + extension : ""}</span>
                <div className='price'>
                    <span className='current'>{price === 0? "Call for pricing" : `$${price.toLocaleString('en', {useGrouping: true})}.00`}</span>
                    {price !== variation.price?
                        <span className='base'>(Starting at ${variation.price.toLocaleString('en', {useGrouping: true})})</span>
                        :
                        ""
                    }
                </div>
                <p className='description'>{product.description}</p>
                <div className='buttons'>
                    <Button role="primary" style="filled" onPress={() => setOpen(true)}>Product Details</Button>
                    <IconButton style="text" icon="picture_as_pdf" onPress={openPDF} />
                </div>
            </div>
            <div className='options'>
                <Heading>Options</Heading>
                {variation.overview.finishes.length !== 0?
                    <FinishesMenu choices={variation.overview.finishes} updateChoiceValues={updateChoiceValues} />
                    :
                    ""
                }
                {Object.entries(variation.overview.options).map(([name, {link_name, content}]) => (
                    <DropdownMenu 
                        key={name}
                        name={name}
                        choices={content}
                        linkName={link_name}
                        linkValue={choiceValues[link_name.toLowerCase()]}
                        updateChoiceValues={updateChoiceValues}
                    />
                ))}
            </div>
            <Modal open={open} setOpen={setOpen}>
                <div className='metadata-overview'>
                    <div className='drawing'>
                        <Heading>Drawing</Heading>
                        <Image src={images.drawing} alt="" />
                    </div>
                    <div className='miscellaneous'>
                        <Heading>Overview</Heading>
                        {variation.overview.specifications?
                            <div className='specifications'>
                                <Subheading>Specifications</Subheading>
                                <span>Height: {variation.overview.specifications.height.measurement} {variation.overview.specifications.height.unit}</span>
                                <span>Width: {variation.overview.specifications.width.measurement} {variation.overview.specifications.width.unit}</span>
                                <span>Depth: {variation.overview.specifications.depth.measurement} {variation.overview.specifications.depth.unit}</span>
                                <span>Weight: {variation.overview.specifications.weight.measurement} {variation.overview.specifications.weight.unit}</span>
                            </div>
                            :
                            ""
                        }
                        {variation.overview.ul.length > 0 || variation.overview.ul[0] === "None"?
                            <div className='ul-info'>
                                <Subheading>UL Listing</Subheading>
                                <span>This product is listed for use in {variation.overview.ul[0].toUpperCase()} environments.</span>
                            </div>
                            :
                            ""
                        }
                        {variation.overview.bulb.quantity > 0?
                            <div className='bulb-info'>
                                <Subheading>Bulb Information</Subheading>
                                <span>{variation.overview.bulb.shape.name} Bulb ({variation.overview.bulb.shape.code}) {variation.overview.bulb.socket.name} Base ({variation.overview.bulb.socket.code})</span> 
                                <span>{variation.overview.bulb.specifications} recommended</span>
                                <span>({variation.overview.bulb.quantity} count)</span>
                            </div>
                            :
                            ""
                        }
                        {variation.replacements.length > 0?
                            <div className='replacements'>
                                <Subheading>Replacements</Subheading>
                                <div className='list'>
                                    {variation.replacements.map(replacement =>(
                                        <div key={`${replacement.id}-${replacement.extension}`} className="replacement">
                                            <span>{replacement.name}{replacement.subname === "DEFAULT"? "" : ` [${replacement.subname}]`}</span>
                                            <span>{replacement.id}{replacement.extension === "DEFAULT"? "" : `-${replacement.extension}`}</span>
                                            <span>${replacement.price.toLocaleString('en', {useGrouping: true})}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            :
                            ""
                        }
                        {variation.overview.notes !== ''?
                            <div className='notes'>
                                <Subheading>Notes</Subheading>
                                <span>{variation.overview.notes}</span>
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