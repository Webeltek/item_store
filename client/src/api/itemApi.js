import { useContext, useEffect, useState } from "react";
import request from "../utils/request"
import useAuth from "../hooks/useAuth";
import { UserContext } from "../contexts/UserContext";
import { useLocation } from "react-router-dom";

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
        return request.delete(`${baseUrl}/${itemId}`)
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
    const location = useLocation();
    //take items from location state if navigating from ItemDetails after delete item
    const [items, setItems] = useState(location.state?.items || []);
    
    useEffect(()=>{
        if(!location.state?.items){
        
            setIsPending(true);
            request.get(`${baseUrl}`)
            .then( result =>{
                setIsPending(false);
                setItems(result);
            }).catch(err=>{
                
                showErrorMsg(err.message)
            });
        }

    },[showErrorMsg,location.state?.items])

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

export const useOrderedOwnedItems = ()=>{
    const { showErrorMsg } = useContext(UserContext);
    const { request, accessToken, ...rest } = useAuth();
    const [ isPending, setIsPending ] = useState(false);
    const [ownedItems, setOwnedItems] = useState([]);
    const [orderedItems, setOrderedItems] = useState([]);

    console.log({useOrdOwndItmsRest: rest, accessToken});
    useEffect(()=>{
        setIsPending(true);

        
        if(!accessToken){
            return;
        }

        Promise.all([
            request.get(`${baseUrl}/owned`,null),
            request.get(`${baseUrl}/ordered`,null)])
        .then(([ownedResult,orderedResult]) =>{
            setIsPending(false);
            setOwnedItems(ownedResult);
            setOrderedItems(orderedResult);
        }).catch(err=> showErrorMsg(err.message));

    },[accessToken,showErrorMsg, request])  // TODO fix missing dependency request making endless cycle

    return {
        ownedItems,
        orderedItems,
        isPending
    }
}

export const useOwnedItems = ()=> {
    const { showErrorMsg } = useContext(UserContext);
    const { accessToken, request } = useAuth();
    const [ isPending, setIsPending ] = useState(false);
    const [ownedItems, setOwnedItems] = useState([]);

    useEffect(()=>{
        setIsPending(true);
        if(!accessToken){
            return;
        }


        request.get(`${baseUrl}/owned`,null)
        .then( result =>{
            setIsPending(false);
            setOwnedItems(result);
        }).catch(err=> showErrorMsg(err.message));

    },[accessToken,showErrorMsg, request])  // TODO fix missing dependency request making endless cycle

    return {
        ownedItems,
        isPending
    }
}

export const useOrderedItems = ()=> {
    const { showErrorMsg } = useContext(UserContext);
    const { accessToken , request} = useAuth();
    const [ isPending, setIsPending ] = useState(false);
    const [orderedItems, setOrderedItems] = useState([]);
    useEffect(()=>{
        setIsPending(true);
        if(!accessToken){
            return;
        }


        request.get(`${baseUrl}/ordered`,null)
        .then( result =>{
            setIsPending(false);
            setOrderedItems(result);
        }).catch(err => showErrorMsg(err.message));

    },[accessToken, showErrorMsg, request])

    return {
        orderedItems,
        isPending
    }
}

