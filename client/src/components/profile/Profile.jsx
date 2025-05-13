import { useEffect, useState } from "react"
import { Link } from 'react-router'
import './Profile.css'
import { useOrderedItems, useOrderedOwnedItems, useOrderItem, useOwnedItems } from "../../api/itemApi";
import ProfileItem from "./profile-item/ProfileItem";
import EditProfile from "./edit-profile/EditProfile";


export default function Profile() {
    // const  { ownedItems , isPending}  = useOwnedItems();
    // const { orderedItems } = useOrderedItems();

    const { ownedItems, orderedItems} = useOrderedOwnedItems();
    
    
    return (
        <>
        <EditProfile />

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