import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEditItem, useItem } from "../../api/itemApi";
import { useActionState, useEffect, useState } from "react";
import  classes from './EditItem.module.scss'
import useAuth from "../../hooks/useAuth";
import { hasLength, useForm } from '@mantine/form'
import { ItemFormValues } from "../../interfaces/ItemInterfaces"
import { Button, NumberInput, Textarea, TextInput, Title } from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";
import  Media from "../image-uploader/Media";

export default function EditItem() {
    const [pending, setPending] = useState<undefined | boolean>(undefined);
    const { _id: userId} = useAuth()
    const navigate = useNavigate();
    const { edit } = useEditItem();
    const { itemId } = useParams();
    const { item } = useItem(itemId);
    const form = useForm<ItemFormValues>({
        mode: 'controlled',
        initialValues: {
            name: '',
            price: '',
            stock: '',
            images: [],
            description: '',
        },
        validate: {
            name: (value) => (!value ? 'Name is required!' : value.length < 5 ? 'Model must be at least 5 characters!' : null),
            stock: (value) => {
                if (Number(value) < 0 ){ return 'Stock must be positive number!'}
                if (value === '') { return 'Stock is required!'}
                return null;
            },
            price: (value) => {
                if (Number(value) < 0 ){ return 'Price must be positive number!'}
                if (value === '') { return 'Price is required!'}
                return null;
            },
            description: (value) => (!value ? 'Description is required!' : value.length < 10 ? 'Description must be at least 10 characters!' : null),
        },
            });

    useEffect(() => {
        if (item) {
            form.initialize({
            name: item.name,
            price: item.price,
            stock: item.stock,
            images: item.images,
            description: item.description,
            });
        }
    }, [item]);        

    const submitData = async ( data)=>{
        try {
            setPending(true);
            await edit(itemId, data);
            setPending(false);
            navigate('/items');
        } catch (err) {
            setPending(false);
            
        }
    }

    
    const isOwner = userId === item?.owner; 
    if(item?.owner !== undefined  && !isOwner){ 
        // console.log("evalIsOwner", isOwner);
        return <Navigate to="/items" />
    }
    

    return (
        <>
        <section className="flex-col  shadow-xl rounded-xl w-[28rem] md:w-[35rem] my-8 mx-[calc((100%-28rem)/2)] md:mx-[calc((100%-35rem)/2)] p-4 bg-white">
                <Title c="gray.5" ta="center" order={2}>Edit product</Title>
                <form className="flex flex-col gap-[0.5rem] mx-8" onSubmit={form.onSubmit(submitData)}> 
                    <TextInput variant="default"  label="Product name:" 
                    {...form.getInputProps('name')}  
                    />
                    <NumberInput variant="default" label="In Stock:" 
                    classNames={{ root: classes.numberImput }} {...form.getInputProps('stock')}
                    />
                    <NumberInput leftSection={<IconCurrencyDollar />} variant="default" label="Price:" 
                    classNames={{ root: classes.numberImput }} {...form.getInputProps('price')}
                    />    
                    <Media addItemForm={form} />
                    {/* <div className="form-group">
                        <label htmlFor="imageFile">Image File:</label>
                        <input
                        defaultValue={item.imageFile}
                        type="file" 
                        id="imageFile" 
                        name="imageFile" 
                        // onChange={onFileSelected}
                        // blur={onFileTouched}
                        />
                            <div>
                                    <p className="error">
                                        set File error message
                                    </p>
                            </div>
                    </div> */}
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
                        classNames={{ root: classes.editProductBtn }}
                        color='var(--mantine-color-ocean-blue-5)'
                        disabled={pending}
                        type="submit"
                        >Edit Product
                    </Button>
                </form>
        </section>

        </>
    );
}