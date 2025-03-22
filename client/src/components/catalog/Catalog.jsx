import { useEffect, useState } from 'react'
import './Catalog.css'
import CatalogItem from './catalog-item/CatalogItem';
import Loader from '../shared/Loader';
import { useItems } from '../../api/itemApi';

export default function Catalog(){
    const { items , isPending} = useItems();

    return (
        <>
        <section className="catalog-hero">
            <div className="container">
                <h2>Tv Catalog</h2>
                <p>Explore our extensive range of TVs and accessories.</p>
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
                        <p className="no-post">There haven&apos;t been any tvs posted yet.</p>
                    }
                </div>
                }
            </div>
        </section>
        </>


    )
}