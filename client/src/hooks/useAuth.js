import { useCallback, useContext, useMemo, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import request from "../utils/request";


export default function useAuth(){
    const { accessToken, showErrorMsg, ...contextData} = useContext(UserContext);
    
    const requestWrapper = useCallback( async (method, url,data,options = {}) =>{
        const authOptions = {
            ...options,
            headers: {
                'X-Authorization': accessToken,
                ...options.headers
            }
        }
        
        try {
            const result = await request.baseRequest(method,url, data, accessToken ? authOptions : options);
            return result;
        } catch (error) {
            showErrorMsg(error.message);
            throw error;
        }
    },[accessToken, showErrorMsg])

    const requestObj = useMemo(()=> (
        {
            get: requestWrapper.bind(null,'GET'),
            post: requestWrapper.bind(null, 'POST'),
            put: requestWrapper.bind(null, 'PUT'),
            delete: requestWrapper.bind(null, 'DELETE'),
        }
    ),[requestWrapper])

    return {
        accessToken,
        ...contextData,
        showErrorMsg,
        isAuthenticated: !!accessToken,
        request : requestObj
    }

}