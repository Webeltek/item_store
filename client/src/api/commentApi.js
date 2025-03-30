import { useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";
import { UserContext } from "../contexts/UserContext";

const baseUrl = import.meta.env.VITE_API_URL;

export const useCreateComment = () => {
    const { request } = useAuth();
    
    const create = (itemId, comment) => {
        return request.post(`${baseUrl}/messages/${itemId}`, { messageText: comment })
    }
    
    return { create }
} 

export const useComments = (itemId) => {
    const { showErrorMsg } = useContext(UserContext);
    const [comments , setComments] = useState([]);

    useEffect(() => {
        request.get(`${baseUrl}/messages/${itemId}`)
        .then(setComments)
        .catch( err => showErrorMsg(err.message));

    },[itemId,showErrorMsg]);

    return { comments, setComments };
}