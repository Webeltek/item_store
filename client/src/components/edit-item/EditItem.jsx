import { useNavigate, useParams } from "react-router-dom";
import { useEditItem, useItem } from "../../api/itemApi";
import { useActionState } from "react";
import './EditItem.css'

export default function EditItem() {
    const navigate = useNavigate();
    const { edit } = useEditItem();
    const { itemId } = useParams();
    const { item } = useItem(itemId);

    const submitHandler = async ( _ , formData)=>{
        const data = Object.fromEntries(formData);
        await edit(itemId, data);

        navigate('/catalog');
        return data;
    }

    const [_, editAction, isPending ] = useActionState(submitHandler, {
        model: '',
        screenSize: '',
        price: '',
        image: '',
        imageFile: null,
        description: ''
    })

    return (
        <>
        <section className="edit-hero">
            <div className="container">
                <h2>Edit Product</h2>
                <p>Fill in the details below to edit a product to the catalog.</p>
            </div>
        </section>

        <section className="edit-form">
            <div className="container">
                <form  action={editAction}> 
                    <div className="form-group">
                        <label htmlFor="model">Model:<span className="red">*</span></label>
                        <input
                        defaultValue={item.model}
                        type="text" 
                        id="model" 
                        name="model" />
                    </div>
                        <div>
                                <p className="error">
                                    Model is required!
                                </p>
                                <p className="error">
                                    Model must be at least 5 characters!
                                </p>
                        </div>
                    <div className="form-group">
                        <label htmlFor="screen-size">Screen Size:<span className="red">*</span></label>
                        <input
                        defaultValue={item.screenSize}
                        type="text" 
                        id="screen-size" 
                        name="screenSize" />
                    </div>
                        <div>
                                <p className="error">
                                    Screen size is required!
                                </p>
                                <p className="error">
                                    Screen size must be at least 2 characters!
                                </p>
                        </div>
                    <div className="form-group">
                        <label htmlFor="price">Price:<span className="red">*</span></label>
                        <input
                        defaultValue={item.price}
                        type="number" 
                        id="price" 
                        name="price" />
                    </div>
                        <div>
                                <p className="error">
                                    Price must be positive number!
                                </p>
                        </div>
                    <div className="form-group">
                        <label htmlFor="image">Image Link:<span className="red">*</span></label>
                        <input
                        defaultValue={item.image}
                        // pattern="^https:\/\/.*$"
                        type="text" 
                        id="image" 
                        name="image" />
                    </div>
                        <div>
                                <p className="error">
                                    Image address is required!
                                </p>
                                <p className="error">
                                    Image address must start with https://!
                                </p>
                        </div>
                    <div className="form-group">
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
                    </div>
                    <div className="new-theme-content">
                        <label htmlFor="phoneText">Description <span className="red">*</span></label>
                        <textarea
                        defaultValue={item.description}
                        type="text" 
                        name="description" 
                        id="postText" 
                        rows="5" 
                        
                        ></textarea>
                            <div>
                                    <p className="error">
                                        Description is required!
                                    </p>
                                    <p className="error">
                                        Description must be at least 10 characters!
                                    </p>
                            </div>
                    </div>
                    
                    <button  
                    disabled={isPending} 
                    className="btn"
                    style={
                        { backgroundColor: isPending ? 'grey':'#0073e6'}
                    }>Edit Product</button>
                </form>
            </div>
        </section>

        </>
    );
}