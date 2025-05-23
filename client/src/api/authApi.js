import { useContext, useEffect, useRef } from "react";
import request from "../utils/request";
import { UserContext } from "../contexts/UserContext";

const baseUrl = import.meta.env.VITE_API_URL;

export const useLogin = () => {
    const { showErrorMsg } = useContext(UserContext);
    const abortRef = useRef(new AbortController());
    const isPendingRef = useRef(false);

    const login = async (email, password,recaptchaToken) => {
        isPendingRef.current = true;
        try {
            const result = await request.post(
                `${baseUrl}/login`, 
                {email, password, recaptchaToken}, 
                { signal: abortRef.current.signal}
            );
            return result;
        } catch (error) {
            showErrorMsg(error.message);
            throw error;
        } finally {
            isPendingRef.current = false;
        }
    }

    useEffect(() => {
        const abortController = abortRef.current;
        return  () => {
            if (isPendingRef.current && abortController){
                abortController.abort();
            }
        }
    },[]);

    return { login }
}

export const useFirebaseLogin = ()=>{
    const { showErrorMsg, userLoginHandler } = useContext(UserContext);
    const firebaseLogin = async (idToken)=>{
        try {
            const result = await request.post(
                `${baseUrl}/verify_gtoken`, 
                { idToken }
            );
            return result;
        } catch (error) {
            showErrorMsg(error.message);
            throw error;
        }
    }

    return {
        firebaseLogin,
        userLoginHandler
    }
}

export const useRegister = () => {
    const { showErrorMsg } = useContext(UserContext);
    const register = async (username, email, password, rePassword, recaptchaToken) =>{
        try {
            
            const result = await request.post(`${baseUrl}/register`, 
                {username, email, password, recaptchaToken}); // returning expression body - one line
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

export const useDeleteProfile = ()=>{
    const { showErrorMsg } = useContext(UserContext);
    const { accessToken} = useContext(UserContext);

    const options = { 
        headers: { 'X-Authorization': accessToken}
    };

    const deleteProfile = async ()=>{
        try {
            const result = await request.get(`${baseUrl}/users/delete_profile`, null, options)
            return result;
        } catch (error) {
            showErrorMsg(error.message);
            throw error;
        }
    }

    return { deleteProfile};
}
