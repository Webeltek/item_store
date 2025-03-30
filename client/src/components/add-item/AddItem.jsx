import { useNavigate } from "react-router-dom";
import SubmitBtn from "./SubmitBtn";
import './AddItem.css'
import { useCreateItem } from "../../api/itemApi";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddItem() {
		const [errorMsg, setErrorMsg] = useState();
		const [pending, setPending] = useState();
    const navigate = useNavigate();
    const { create } = useCreateItem();
    const { register, handleSubmit, formState: { errors },} = useForm({
			mode: 'onBlur',
			reValidateMode: 'onBlur'
		});

    const submitData = async (data)=>{
			// using react hook form - data parameter contains form values;
			
			
			try {
				setPending(true);
        await create(data);
				setPending(false);
        navigate('/items');
				
			} catch (err) {
				setPending(false);
				setErrorMsg(err.message);
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
                
                <button  
									className="btn"
									disabled={pending}
									style={ {backgroundColor: pending ? 'grey':'#0073e6' }}
									>Create Product
								</button>
            </form>
        </div>
    </section>    
    </>    
    );
}