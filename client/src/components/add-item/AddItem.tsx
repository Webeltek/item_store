import { useNavigate } from "react-router-dom";
import SubmitBtn from "./SubmitBtn";
import { useCreateItem } from "../../api/itemApi";
import { hasLength, useForm } from '@mantine/form'
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'
import Media from "./image-uploader/Media";
import classes from './AddItem.module.scss'
import { NumberInput, TextInput, Title, Textarea, Button } from "@mantine/core";
import { IconBrandProducthunt } from "@tabler/icons-react";

export interface MediaProps {
  product?: {
    image?: {
      uuid: string;
      path: string;
      url: string;
    };
    gallery?: {
      uuid: string;
      path: string;
      url: string;
    }[];
  },
}

export default function AddItem() {
    const [errorMsg, setErrorMsg] = useState();
    const [pending, setPending] = useState<undefined | boolean>();
    const navigate = useNavigate();
    const { create } = useCreateItem();
    const [product, setProduct] = useState<MediaProps['product'] | null>(null);

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            name: '',
            price: '',
            images: product?.image
                ? [product.image].concat(product?.gallery || [])
                : [],
            product: {} as MediaProps,
            description: '',
        },
        validate: {
            name: (value) => (!value ? 'Name is required!' : value.length < 5 ? 'Model must be at least 5 characters!' : null),
            price: (value) => {
                if (Number(value) < 0 ){ return 'Price must be positive number!'}
                if (value === '') { return 'Price is required!'}
                return null;
            },
            // image: (value) => {
            //     if (!value) return 'Image address is required!';
            //     if (!/^https:\/\/.*$/.test(value)) return 'Image address must start with https://!';
            //     return null;
            // },
            description: (value) => (!value ? 'Description is required!' : value.length < 10 ? 'Description must be at least 10 characters!' : null),
        },
		});



    const createEvershopProd = (name, price, desc, images)=>{
        return {
            "name": name,
            "sku": "32123",
            "price": price,
            "weight": 2,
            "tax_class": "1",
            "description": [
                {
                    "id": `r__${uuidv4()}`,
                    "editSetting": true,
                    "columns": [
                        {
                            "size": 1,
                            "className": "md:col-span-1",
                            "id": `c__${uuidv4()}`,
                            "data": {
                                "time": new Date().getTime(),
                                "blocks": [
                                    {
                                        "id": nanoid(10),
                                        "type": "paragraph",
                                        "data": {
                                            "text": desc
                                        }
                                    }
                                ],
                                "version": "2.31.0-rc.7"
                            }
                        }
                    ],
                    "size": 1,
                    "className": "md:grid-cols-1"
                }
            ],
            "url_key": "poco-url-key",
            "meta_title": "poco-meta-title",
            "meta_keywords": "",
            "meta_description": "poco-meta-descr",
            "status": 1,
            "visibility": 1,
            "manage_stock": 1,
            "stock_availability": 1,
            "qty": 2,
            "group_id": "1",
            "images": images,
            "attributes": [
                {
                    "attribute_code": "color",
                    "attribute_name": "Color",
                    "type": "select",
                    "attribute_id": "1",
                    "value": "",
                    "is_required": 0
                },
                {
                    "attribute_code": "size",
                    "attribute_name": "Size",
                    "type": "select",
                    "attribute_id": "2",
                    "value": "",
                    "is_required": 0
                }
            ]
            }
        }

    const submitData = async (data)=>{
		// using react hook form - data parameter contains form values;	
		try {
            setPending(true);
            await create(data);
            setPending(false);
            navigate('/items');
				
        } catch (err) {
            setPending(false);
        }
    }

    const testProdSubmit = async (data) => {
        const evershProd = createEvershopProd(data.name, data.price,data.description, data.images);
        try {
        setPending(true);
        const res = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(evershProd)
        });
        if (!res.ok) throw new Error(await res.text());
        setPending(false);
        return res.json();
        } catch (err) {
            setPending(false);
        }
    }

    return (
    <>

    <section className="flex-col  shadow-xl rounded-xl w-[35rem] my-8 mx-[calc((100%-35rem)/2)] p-4 bg-white">
        <Title c="gray.5" ta="center" order={2}>Add product to the catalog</Title>
        <form className="flex flex-col gap-[0.5rem] mx-8" onSubmit={form.onSubmit(submitData)}>
            <TextInput variant="default"  label="Product name:" 
                leftSection={<IconBrandProducthunt />}
            {...form.getInputProps('name')}  
            />
            <NumberInput variant="default" label="Price:" 
            classNames={{ root: classes.numberImput }} {...form.getInputProps('price')}
            />    
            <Media addItemForm={form} />
            <Textarea
                classNames={{ 
                    label: classes.textAreaLabel,
                    input: classes.textArea
                }} 
                label="Description:"
                rows={5}
                placeholder="Product description"
                {...form.getInputProps('description')}
            />
            <Button  
                classNames={{ root: classes.createProductBtn }}
                color='var(--mantine-color-ocean-blue-5)'
                disabled={pending}
                type="submit"
                >Create Product
            </Button>
            <button
                onClick={() => form.onSubmit(testProdSubmit)}  
                className="btn"
                type="button"
                disabled={pending}
                style={ {backgroundColor: pending ? 'grey':'#0073e6',
                    marginTop: '3em'
                    }}
                >Create Evershop Test Product
            </button>
        </form>
    </section>    
    </>    
    );
}