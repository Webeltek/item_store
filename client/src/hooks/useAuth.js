import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import request from "../utils/request";

function readErrorMessage(error){
    if(error.message === 'jwt expired'){
        return "Session expired, please login again!"
    } else if (error.message === 'invalid token'
        || error.message === 'blacklisted token'
        || error.message === 'jwt must be provided'
    ){
        return 'Invalid session, please login again!'
    }

    return error.message;
}

export default function useAuth(){
    const authData = useContext(UserContext);
    

    const requestWrapper = async (method, url,data,options = {}) =>{
        // console.log('authData.accessToken', authData.accessToken);
        
        const authOptions = {
            ...options,
            headers: {
                'X-Authorization': authData.accessToken,
                ...options.headers
            }
        }

        //console.log('authOptions', authOptions);
        try {
            
            const result = await request.baseRequest(method,url, data, authData.accessToken ? authOptions : options);
            return result;
        } catch (error) {
            const finalMessage = readErrorMessage(error.message);
            
            authData.showErrorMsg(finalMessage);
            throw error;
        }
    }

    return {
        ...authData,
        isAuthenticated: !!authData.accessToken,
        request : {
            get: requestWrapper.bind(null,'GET'),
            post: requestWrapper.bind(null, 'POST'),
            put: requestWrapper.bind(null, 'PUT'),
            delete: requestWrapper.bind(null, 'DELETE'),
        }
    }

}