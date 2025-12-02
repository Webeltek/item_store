import { useEffect, useState } from 'react'
import CatalogItem from './catalog-item/CatalogItem';
import Loader from '../shared/Loader';
import { useItems } from '../../api/itemApi';

export default function Catalog(){
    const { items , isPending} = useItems();

    return (
        <>
        <section className="py-4 text-centeр">
                <h2 className="uppercase text-xl text-orange-400">Catalog</h2>
                <p className='text-sky-600'>Explore our products.</p>
        </section>

        <section className="">
                {isPending
                ? <Loader />
                : 
                <div className="container my-4 mx-auto">
                    <div className="flex justify-center gap-y-4 flex-wrap">
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
                </div>
                }
        </section>
        </>


    )
}