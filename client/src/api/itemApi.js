import { useContext, useEffect, useState } from "react";
import request from "../utils/request"
import useAuth from "../hooks/useAuth";
import { UserContext } from "../contexts/UserContext";

const baseUrl = `${import.meta.env.VITE_API_URL}/items`;

export const useCreateItem = ()=> {
    const { request } = useAuth();
    
    const create = (itemData) => {
        return request.post(baseUrl, itemData)
    }

    return {
        create, 
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
        deleteItem, 
    }
}

export const useOrderItem = () => {
    const { request } = useAuth();

    const orderItem = (itemId)=> {
        return request.put(`${baseUrl}/${itemId}/order`);
    }

    return { orderItem };
}

export const useItems = ()=> {
    const { showErrorMsg } = useContext(UserContext);
    const [ isPending, setIsPending ] = useState(false);
    const [items, setItems] = useState([]);
    useEffect(()=>{
        setIsPending(true);
        request.get(`${baseUrl}`)
        .then( result =>{
            setIsPending(false);
            setItems(result);
        }).catch(err=>{
            
            showErrorMsg(err.message)
    });

    },[showErrorMsg])

    return {
        items,
        isPending
    }
}

export const useItem = (itemId) => {
    const { showErrorMsg } = useContext(UserContext);
    const [item, setItem ] = useState({});

    useEffect(()=> {
        request.get(`${baseUrl}/${itemId}`)
        .then(result => {
            // console.log(result);
            setItem(result)
        }).catch(err=> showErrorMsg(err.message))
    },[itemId, showErrorMsg]);

    return {
        item,
        setItem,
    }
}



export const useLatestItems = (size) => {
    const { showErrorMsg } = useContext(UserContext);
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
        }).catch(err => showErrorMsg(err.message));

    },[size,showErrorMsg])

    return { latestItems, isPending }
}

export const useOwnedItems = ()=> {
    const { showErrorMsg } = useContext(UserContext);
    const { accessToken } = useAuth();
    const [ isPending, setIsPending ] = useState(false);
    const [ownedItems, setOwnedItems] = useState([]);
    useEffect(()=>{
        setIsPending(true);
        if(!accessToken){
            return;
        }

        const options = { 
            headers: { 'X-Authorization': accessToken}
        };

        request.get(`${baseUrl}/owned`,null,options)
        .then( result =>{
            setIsPending(false);
            setOwnedItems(result);
        }).catch(err=> showErrorMsg(err.message));

    },[accessToken,showErrorMsg])  // TODO fix missing dependency request making endless cycle

    return {
        ownedItems,
        isPending
    }
}

export const useOrderedItems = ()=> {
    const { showErrorMsg } = useContext(UserContext);
    const { accessToken} = useAuth();
    const [ isPending, setIsPending ] = useState(false);
    const [orderedItems, setOrderedItems] = useState([]);
    useEffect(()=>{
        setIsPending(true);
        if(!accessToken){
            return;
        }

        const options = { 
            headers: { 'X-Authorization': accessToken}
        };


        request.get(`${baseUrl}/ordered`,null,options)
        .then( result =>{
            setIsPending(false);
            setOrderedItems(result);
        }).catch(err => showErrorMsg(err.message));

    },[accessToken, showErrorMsg])

    return {
        orderedItems,
        isPending
    }
}

