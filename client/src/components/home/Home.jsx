import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css'
import Loader from "../shared/Loader";
import { useLatestItems } from "../../api/itemApi";
import { fromIsoDateString } from "../../utils/fromIsoDateString.js";

const imagesUrl = import.meta.env.VITE_IMAGES_URL;

export default function Home(){
    const PAGE_SIZE = 3;
    const { latestItems : items , isPending} = useLatestItems(PAGE_SIZE);


    const isItemsNotEmpty = () =>{
        return items && items.length > 0;
    }

    return (
        <>
            <section className="hero">
                <div className="container">
                    <h2>Pi Boards with Monitoring</h2>
                    <p>Find the best deals on pi boards with monitoring capabilities and accessories.</p>
                    <Link to="/items" className="btn">Shop Now</Link>
                </div>
            </section>

            <section className="products">
            {isPending
            ? <Loader />
            : 
            <div className="container">
                <h2>Featured Products</h2>
                <div className="product-grid">
                    {isItemsNotEmpty() &&
                        items.map( item=> 
                            <div key={item._id} className="product-item">
                                { item.imageFile && (
                                    <img src={item.imageFile ? item.imageFile : ''} alt="Phone" />
                                )}
                                
                                <img src={item.image ? item.image : item.images && item.images && item.images.length > 0 ? item.images[0].url : ''} />
                                <p>Added: {fromIsoDateString(item.created_at) }</p>
                                <h3> {item.model}</h3>
                                <p>${item.price}</p>
                                <Link to={`/items/${item._id}/details`} className="btn">View Details</Link>
                            </div>
                        )
                        }
                        
                    { isItemsNotEmpty() || 
                        <p className="no-post">There haven&apos;t been any tvs posted yet.</p>
                    }
                    
                </div>
            </div>
                }
                

            </section>        
        
        </>
    )
}