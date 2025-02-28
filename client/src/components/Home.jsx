import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { environment } from '../environments/environment';
import './Home.css'

export default function Home(){
    const [ items, setItems] = useState([]);
    const [isPending, setIspending] = useState(true);
    const imagesUrl = environment.IMAGES_URL;

    useEffect(()=>{
        fetch('http://localhost:3100/api/items/latest',{
            method: 'get'
        })
        .then( res => res.json())
        .then( data => {
            // console.log({data});
            setItems(data);
        })
        .catch( err =>{
            console.log({errMsg: err.message});
            
        })
    },[])

    const isItemsEmpty = () =>{
        return items && items.length > 0;
    }

    return (
        <>
        <section className="hero">
            <div className="container">
                <h2>Your One-Stop Tv store</h2>
                <p>Find the best deals on the latest tv and accessories.</p>
                <Link to="/items" className="btn">Shop Now</Link>
            </div>
        </section>

        <section className="products">
            <div className="container">
                <h2>Featured Products</h2>
                <div className="product-grid">
                    {isItemsEmpty() &&
                        items.map( item=> 
                            <div key={item._id} className="product-item">
                                 { item.imageFile && (
                                    <img src={imagesUrl + item.imageFile} alt="Phone" />
                                 )}
                                
                                <img src={item.image} />
                                <p>Added: {item.created_at }</p>
                                <h3> {item.model}</h3>
                                <p>${item.price}</p>
                                <Link to={`/items/${item._id}`} className="btn">View Details</Link>
                            </div>
                        )
                        }
                        
                    { isItemsEmpty() || 
                        <p className="no-post">There haven&apos;t been any devices posted yet.</p>
                    }
                    
                </div>
            </div>


        </section>
        
        </>
    )
}