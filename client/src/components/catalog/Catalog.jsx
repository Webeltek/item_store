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
                <h2>Tv Catalog</h2>
                <p>Explore our extensive range of TVs and accessories.</p>
        </section>

        <section className="catalog">
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
        </section>
        </>


    )
}