import { useContext, useEffect, useReducer, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";
import { UserContext } from "../contexts/UserContext";

const baseUrl = import.meta.env.VITE_API_URL;

function commentsReducer(state, action){
    switch (action.type){
        case 'ADD_COMMENT':
            return [...state, action.payload]
        case 'GET_ALL':
            console.log('GET_ALL', action.payload);
            
            return action.payload
        default:
            return state;    
    }
}

export const useComments = (itemId) => {
    const { showErrorMsg } = useContext(UserContext);
    //const [comments , setComments] = useState([]);
    const [ comments, dispatch ]= useReducer(commentsReducer,[]);
    
    
    useEffect(() => {
        request.get(`${baseUrl}/messages/${itemId}`)
        .then( result => {
            console.log('comments result: ',result);
            
            dispatch({ type: 'GET_ALL', payload: result})
        })
        .catch( err => showErrorMsg(err.message));
        
    },[itemId,showErrorMsg]);
    
    return { 
        comments, 
        addComment: ( commentData ) => dispatch({ type: 'ADD_COMMENT', payload: commentData }) 
    };
}

export const useCreateComment = () => {
    const { request } = useAuth();
    
    const create = (itemId, comment) => {
        return request.post(`${baseUrl}/messages/${itemId}`, { messageText: comment })
    }
    
    return { create }
} 