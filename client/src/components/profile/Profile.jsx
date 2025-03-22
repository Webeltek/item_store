import { useEffect, useState } from "react"
import { IMAGES_URL } from "../../constants";
import { Link } from 'react-router'
import './Profile.css'
import { useOrderedItems, useOrderItem, useOwnedItems } from "../../api/itemApi";

export default function Profile() {
    const [isEditMode, setEditMode] = useState(false);
    const [profileDetails, setProfileDetails] = useState({});
    const  { ownedItems , isPending}  = useOwnedItems();
    const { orderedItems } = useOrderedItems();

    const toggleEditMode = () => {
        setEditMode( state=> !state);
    }

    const handleSaveProfile = () => {

    }

    return (
        <>
        <section className="profile-hero">
            <div className="container">
                <h2>User Profile</h2>
                {/* <!-- Readonly mode--> */}
                { !isEditMode
                    ?
                    <>
                        <div className="flex-prof">
                            <p>Username: </p>
                            <p>{profileDetails.username}</p>
                        </div>
                        <div className="flex-prof">
                            <p>Email: </p>
                            <p>{profileDetails.email}</p>
                        </div>
                        <div style={ { marginTop: '0px' }}>
                            <button className="edit-button" onClick={toggleEditMode}>Edit</button>
                        </div>
                    </>
                : 
                <>
                    <form  action={handleSaveProfile}>
                        <div className="flex-prof">
                            <p>Username: </p>
                            <input 
                            type="text" name="username" id="username" />
                        </div>
                            <div>
                                    <p className="error">
                                        Username is required!
                                    </p>
                                    <p className="error">
                                        Username must be at least 5 characters!
                                    </p>
                            </div>
                        <div className="flex-prof">
                            <p>Email: </p>
                            <input
                            type="email" name="email" id="email" />
                        </div>
                            <div>
                                    <p className="error">
                                        Email is required!
                                    </p>
                                    <p className="error">
                                        Email is not valid!
                                    </p>
                            </div>
                        <div style={ { marginTop : '20px'} }>
                            <button className="cancel-button" onClick={toggleEditMode}>Cancel</button>
                            <button className="save-button" 
                            // disabled="form.invalid" 
                            style={ {
                                marginLeft: '50px',
                                // backgroundColor: form.invalid ? 'grey':'#5cb85c',
                                // borderColor: form.invalid ? 'grey': '#5cb85c'
                            } }>Save</button>
                        </div>
                    </form>
                </>
                }
            </div>
        </section>

        <section className="created-laptops">
            <div className="container">
                <h3>Added Phones</h3>
                <div className="laptop-list">
                    { ownedItems.length >0 ?
                        ownedItems.map( item => 
                            <div key={item._id} className="laptop-item">
                                { item.imageFile &&
                                    <img src={`${IMAGES_URL}${item.imageFile}`} alt="Phone" />
                                }
                                <img src={item.image}
                                    alt="Laptop" />
                                <p><strong>Price:</strong> {item.price}</p>
                                <p><strong>Model:</strong> {item.model}</p>
                                <Link to={`/items/${item._id}`} className="btn">View Details</Link>
                            </div>
                        ) 
                            
                    :
                    <p className="no-post">You haven&apos;t added a Tv yet</p>
                    }
                </div>
            </div>
        </section>

        <section className="preferred-laptops">
            <div className="container">
                <h3>Ordered Tv&apos;s</h3>
                <div className="laptop-list">
                    { orderedItems.length >0 ?
                        orderedItems.map( item => 
                            <div key={item._key} className="laptop-item">
                                { item.imageFile && 
                                    <img src={`${IMAGES_URL}${item.imageFile}`} alt="Phone" />
                                }
                                <img src="{{item.image}}" alt="Laptop" />
                                <p><strong>Price:</strong> {item.price}</p>
                                <p><strong>Model:</strong> {item.model}</p>
                                <Link to={`/items/${item._id}` } className="btn">View Details</Link>
                            </div>
                        ) 
                    :
                    <p className="no-post">You haven&apos;t ordered any Tv&apos;s yet</p>
                    }
                </div>
            </div>
        </section>
        </>
    );
}