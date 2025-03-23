import { useEffect, useState } from "react"
import { Link } from 'react-router'
import './Profile.css'
import { useOrderedItems, useOrderItem, useOwnedItems } from "../../api/itemApi";
import useAuth from "../../hooks/useAuth";
import ProfileItem from "./profile-item/ProfileItem";

const IMAGES_URL  = import.meta.env.VITE_IMAGES_URL;

export default function Profile() {
    const [isEditMode, setEditMode] = useState(false);
    const { email, username } = useAuth();
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
                            <p>{username}</p>
                        </div>
                        <div className="flex-prof">
                            <p>Email: </p>
                            <p>{email}</p>
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

        <section className="created-tvs">
            <div className="container">
                <h3>Added TVs</h3>
                <div className="tv-list">
                    { ownedItems.length >0 ?
                        ownedItems.map( item => 
                            <ProfileItem key={item._id} item={item} />
                        ) 
                            
                    :
                    <p className="no-post">You haven&apos;t added a Tv yet</p>
                    }
                </div>
            </div>
        </section>

        <section className="preferred-tvs">
            <div className="container">
                <h3>Ordered Tv&apos;s</h3>
                <div className="tv-list">
                    { orderedItems.length >0 ?
                        orderedItems.map( item => 
                            <ProfileItem key={item._id} item={item} />
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