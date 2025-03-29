import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEditItem, useItem } from "../../api/itemApi";
import { useActionState, useState } from "react";
import './EditItem.css'
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

export default function EditItem() {
    const [errorMsg, setErrorMsg] = useState();
    const [pending, setPending] = useState();
    const { _id: userId} = useAuth()
    const navigate = useNavigate();
    const { edit } = useEditItem();
    const { itemId } = useParams();
    const { item } = useItem(itemId);
    const { register, handleSubmit, formState: { errors },} = useForm({
                mode: 'onBlur'
            });

    const submitHandler = async ( data)=>{
        try {
            setPending(true);
            await edit(itemId, data);
            setPending(false);
            navigate('/items');
        } catch (err) {
            setPending(false);
			setErrorMsg(err.message);
        }
    }

    
    const isOwner = userId === item.owner; 
    if(item.owner !== undefined  && !isOwner){ 
        // console.log("evalIsOwner", isOwner);
        return <Navigate to="/items" />
    }
    


    return (
        <>
        { errorMsg && (
				<p className="notification error-message">{errorMsg}</p>
		)}
        <section className="edit-hero">
            <div className="container">
                <h2>Edit Product</h2>
                <p>Fill in the details below to edit a product to the catalog.</p>
            </div>
        </section>

        <section className="edit-form">
            <div className="container">
                <form  onSubmit={handleSubmit(submitHandler)}> 
                    <div className="form-group">
                        <label htmlFor="model">Model:<span className="red">*</span></label>
                        <input
                        className={`${errors.model ? "input-error" : ""}` }
                        defaultValue={item.model}
                        type="text" 
                        id="model" 
                        name="model"
                        {...register('model',{
                            required: 'Model is required!',
                            minLength: { 
                                value: 5,
                                message: 'Model must be at least 5 characters!'}
                        })} />
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
                        defaultValue={item.screenSize}
                        type="text" 
                        id="screen-size" 
                        name="screenSize"
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
                        defaultValue={item.price}
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
                        defaultValue={item.image}
                        // pattern="^https:\/\/.*$"
                        type="text" 
                        id="image" 
                        name="image"
                        {...register('image',{
                            required: 'Image address is required!',
                            pattern : {
                                value : /^https:\/\/.*$/,
                                message : 'Image address must start with https:// !'
                            }
                        })}  />
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
                    <div className="new-theme-content">
                        <label htmlFor="phoneText">Description <span className="red">*</span></label>
                        <textarea
                        className={`${errors.description ? "input-error" : ""}` }
                        defaultValue={item.description}
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
                    disabled={pending} 
                    className="btn"
                    style={
                        { backgroundColor: pending ? 'grey':'#0073e6'}
                    }>Edit Product</button>
                </form>
            </div>
        </section>

        </>
    );
}