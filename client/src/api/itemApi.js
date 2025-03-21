import { useEffect, useState } from "react";
import request from "../utils/request"
import useAuth from "../hooks/useAuth";

const baseUrl = `${import.meta.env.VITE_API_URL}/items`;

export const useCreateItem = ()=> {
    const { request } = useAuth();
    
    const create = (itemData) => {
        return request.post(baseUrl, itemData)
    }

    return {
        create
    }
}


export const useEditItem = () => {
    const { request} = useAuth()

    const edit = (itemId, itemData) => {
        return request.put(`${baseUrl}/${itemId}`, {...itemData, _id: itemId});
    }

    return {
        edit,
    }
}

export const useDeleteItem = ()=> {
    const { request } = useAuth();

    const deleteItem = (itemId) => {
        request.delete(`${baseUrl}/${itemId}`)
    }

    return {
        deleteItem
    }
}

export const useItems = ()=> {
    const [ isPending, setIsPending ] = useState(false);
    const [items, setItems] = useState([]);
    useEffect(()=>{
        setIsPending(true);
        request.get(`${baseUrl}`)
        .then( result =>{
            setIsPending(false);
            setItems(result);
        });

    },[])

    return {
        items,
        isPending
    }
}

export const useItem = (itemId) => {
    const [item, setItem ] = useState({});

    useEffect(()=> {
        request.get(`${baseUrl}/${itemId}`)
        .then(setItem)
    },[itemId]);

    return {
        item,
    }
}



export const useLatestItems = (size) => {
    const [ isPending, setIsPending ] = useState(false);
    const [latestItems, setLatestItems] = useState([]);

    useEffect(()=>{
        const searchParams = new URLSearchParams({
            limit: size
        })
        setIsPending(true);
        request.get(`${baseUrl}/latest?${searchParams.toString()}`)
        .then(result => {
            setIsPending(false);
            setLatestItems(result);
        });

    },[size])

    return { latestItems, isPending }
}

