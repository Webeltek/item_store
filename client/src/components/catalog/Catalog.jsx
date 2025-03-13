import { useEffect, useState } from 'react'
import './Catalog.css'
import CatalogItem from './catalog-item/CatalogItem';
import itemsService from '../../services/itemsService';
import Loader from '../shared/Loader';

export default function Catalog(){
    const [ isPending, setIsPending ] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(()=>{
        setIsPending(true);
        itemsService.getAll()
        .then( result => {
            setIsPending(false);
            setItems(result);
        })
    },[])
    return (
        <>
        <section className="catalog-hero">
            <div className="container">
                <h2>Phones Catalog</h2>
                <p>Explore our extensive range of phones and accessories.</p>
            </div>
        </section>

        <section className="catalog">
            <div className="container">
                {isPending
                ? <Loader />
                : 
                <div className="product-grid">
                    { items.length > 0 
                        ?
                        items.map(item => (
                            <CatalogItem key={item._id} {...item}/>
                            )
                        )
                        :
                        <p className="no-post">There haven&apos;t been any devices posted yet.</p>
                    }
                </div>
                }
            </div>
        </section>
        </>


    )
}