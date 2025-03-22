import { useNavigate } from "react-router-dom";
import SubmitBtn from "./SubmitBtn";
import './AddItem.css'
import { useCreateItem } from "../../api/itemApi";

export default function AddItem() {
    const navigate = useNavigate();
    const { create } = useCreateItem()

    const submitHandler = async (formData)=>{
        const data = Object.fromEntries(formData);
        await create(data);

        navigate('/catalog');
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
            <form action={submitHandler}> 
                <div className="form-group">
                    <label htmlFor="model">Model:<span className="red">*</span></label>
                    <input
                    className='input-error' 
                    type="text" id="model" name="model" />
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
                    className='input-error'
                    type="text" id="screen-size" name="screenSize" />
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
                    className="'input-error" 
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
                    className="input-error" 
                    type="text" id="image" name="image" />
                </div>
                    <div>
                            <p className="error">
                                Image address is required!
                            </p>
                            <p className="error">
                                Image address must start with https:// !
                            </p>
                    </div>
                <div className="form-group">
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
                </div>
                <div className="new-theme-content">
                    <label htmlFor="phoneText">Description <span className="red">*</span></label>
                    <textarea
                    className='input-error'  
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
                
                <SubmitBtn />
            </form>
        </div>
    </section>    
    </>    
    );
}