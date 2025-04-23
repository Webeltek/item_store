import { useContext, useEffect, useRef } from "react";
import request from "../utils/request";
import { UserContext } from "../contexts/UserContext";

const baseUrl = import.meta.env.VITE_API_URL;

export const useLogin = () => {
    const { showErrorMsg } = useContext(UserContext);
    const abortRef = useRef(new AbortController());

    const login = async (email, password) => {
        try {
            
            const result = await request.post(
                `${baseUrl}/login`, 
                {email, password}, 
                { signal: abortRef.current.signal}
            );
            return result;
        } catch (error) {
            showErrorMsg(error.message);
            throw error;
        }
    }

    useEffect(() => {
        const abortController = abortRef.current;
        return  () => abortController.abort();
    },[]);

    return { login }
}

export const useRegister = () => {
    const { showErrorMsg } = useContext(UserContext);
    const register = async (username, email, password) =>{
        try {
            
            const result = await request.post(`${baseUrl}/register`, {username, email, password}); // returning expression body - one line
            return result;
        } catch (error) {
            showErrorMsg(error.message);
            throw error;
        }
    } 
    
    return {
        register
    }
}

export const useLogout = () => {
    const { showErrorMsg } = useContext(UserContext);
    const { accessToken, userLogoutHandler } = useContext(UserContext)

    useEffect(() => {
        if(!accessToken){
            return;
        }

        const options = { 
            headers: { 'X-Authorization': accessToken}
        };

        
        request.get(`${baseUrl}/logout`, null, options)
        .catch( err=> showErrorMsg(err.message))
        .finally(userLogoutHandler)
        
    },[accessToken, userLogoutHandler, showErrorMsg]);

    return {
        isLoggedOut: !!accessToken  // TODO is better to return the actual isLoggetOut state from context instead of derived value !!accessToken because !!accessToken is not updated to latest value 
    }
}

export const useEditProfile = ()=>{
    const { showErrorMsg } = useContext(UserContext);
    const { accessToken} = useContext(UserContext);

    const options = { 
        headers: { 'X-Authorization': accessToken}
    };

    const editProfile = async (username, email)=>{
        try {
            const result = await request.put(`${baseUrl}/users/profile`, {username, email}, options)
            return result;
        } catch (error) {
            showErrorMsg(error.message);
            throw error;
        }
    }

    return { editProfile};
}
