import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";

const baseUrl = import.meta.env.VITE_API_URL;

export const useCreateComment = () => {
    const { request } = useAuth();
    
    const create = (itemId, comment) => {
        return request.post(`${baseUrl}/messages/${itemId}`, { messageText: comment })
    }
    
    return { create }
} 

export const useComments = (itemId) => {
    const [comments , setComments] = useState([]);

    useEffect(() => {
        request.get(`${baseUrl}/messages/${itemId}`)
        .then(setComments)

    },[itemId]);

    return { comments, setComments };
}