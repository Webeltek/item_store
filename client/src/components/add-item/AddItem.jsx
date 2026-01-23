import { useNavigate } from "react-router-dom";
import SubmitBtn from "./SubmitBtn";
import './AddItem.css'
import { useCreateItem } from "../../api/itemApi";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'
import Media from "./image-uploader/Media";

export default function AddItem() {
		const [errorMsg, setErrorMsg] = useState();
		const [pending, setPending] = useState();
    const navigate = useNavigate();
    const { create } = useCreateItem();
    const { register, handleSubmit, formState: { errors }, getValues, control} = useForm({
			mode: 'onBlur',
			reValidateMode: 'onBlur'
		});



    const createEvershopProd = (name, price, desc, imageUrl)=>{
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
            "images": [
                "/assets/catalog/4961/5109/xiaomi-poco-c75-.jpg"
            ],
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
        const evershProd = createEvershopProd(data.name, data.price,data.description, data.image);
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
    <section className="create-hero">
        <div className="container">
            <h2>Add New Tv</h2>
            <p>Fill in the details below to add a new product to the catalog.</p>
        </div>
    </section>

    <section className="create-form">
        <div className="container">
            <FormProvider {...{ control}} >
            <form onSubmit={handleSubmit(submitData)}> 
                <div className="form-group">
                    <label htmlFor="model">Model:<span className="red">*</span></label>
                    <input		
                    {...register('model',{
                        required: 'Model is required!',
                        minLength: { 
                            value: 5,
                            message: 'Model must be at least 5 characters!'}
                    })}
                    className={`${errors.model ? "input-error" : ""}` } 
                    type="text" id="model" name="model" />
                </div>
                { errors.model && 
                    <div>
                        <p className="error">
                            {errors.model.message}
                        </p>
                    </div>
                }    
                <div className="form-group">
                    <label htmlFor="screen-size">Screen Size:<span className="red">*</span></label>
                    <input
                    className={`${errors.screenSize ? "input-error" : ""}` }
                    type="text" id="screen-size" name="screenSize"
                    {...register('screenSize',{
                        required: 'Screen size is required!',
                        minLength : {
                            value : 2,
                            message: 'Screen size must be at least 2 characters!'
                        }
                    })} />
                </div>
                { errors.screenSize &&
                <div>
                        <p className="error">
                            {errors.screenSize.message}
                        </p>
                </div>
                }
                    
                <div className="form-group">
                    <label htmlFor="price">Price:<span className="red">*</span></label>
                    <input
                    className={`${errors.price ? "input-error" : ""}` } 
                    type="number" 
                    id="price" 
                    name="price"
                    {...register('price',{
                        min : {
                            value : 0,
                            message: 'Price must be positive number!'
                        },
                    })} />
                </div>
                { errors.price && 
                <div>
                        <p className="error">
                            {errors.price.message}
                        </p>
                </div>
                }
                    
                <div className="form-group">
                    <label htmlFor="image">Image Link:<span className="red">*</span></label>
                    <input
                    className={`${errors.image ? "input-error" : ""}` } 
                    type="text" id="image" name="image"
                    {...register('image',{
                        required: 'Image address is required!',
                        pattern : {
                            value : /^https:\/\/.*$/,
                            message : 'Image address must start with https:// !'
                        }
                    })} />
                </div>
                { errors.image && 
                <div>
                        <p className="error">
                            {errors.image.message}
                        </p>
                </div>
                }
                    
                {/* <div className="form-group">
                    <label htmlFor="imageFile">Image File:</label>
                    <input
                    className="input-error" 
                    type="file" 
                    id="imageFile" 
                    name="imageFile" 
                     />
                    <div>
                            <p className="error">
                                Set fileError msg
                            </p>
                    </div>
                </div> */}
                <div className="new-theme-content">
                    <label htmlFor="phoneText">Description <span className="red">*</span></label>
                    <textarea
                    className={`${errors.description ? "input-error" : ""}` }  
                    type="text" 
                    name="description" 
                    id="postText" 
                    rows="5"
                    {...register('description',{
                        required: 'Description is required!',
                        minLength : {
                            value: 10,
                            message: 'Description must be at least 10 characters!'
                        }
                    })} 
                    ></textarea>
                    { errors.description && 
                    <div>
                                    <p className="error">
                                            { errors.description.message}
                                    </p>
                    </div>
                    }
                        
                </div>
                <Media />
                <button  
                    className="btn"
                    disabled={pending}
                    style={ {backgroundColor: pending ? 'grey':'#0073e6' }}
                    >Create Product
                </button>
                <button
                    onClick={() => handleSubmit(testProdSubmit)}  
                    className="btn"
                    type="button"
                    disabled={pending}
                    style={ {backgroundColor: pending ? 'grey':'#0073e6',
                        marginTop: '3em'
                     }}
                    >Create Evershop Test Product
                </button>
            </form>
            </FormProvider>
        </div>
    </section>    
    </>    
    );
}