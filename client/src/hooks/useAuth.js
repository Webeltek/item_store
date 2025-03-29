import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import request from "../utils/request";

function readErrorMessage(error){
    if(error.message === 'jwt expired'){
        return "Session expired, please login again!"
    } else if (error.message === 'invalid token'){
        return 'Invalid token'
    }
}

export default function useAuth(){
    const authData = useContext(UserContext);
    const [ errorMessage, setErrorMessage] = useState('');

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
        } catch(error){
            const finalMessage = readErrorMessage(error);
            console.log({useAuthErr: error, finalMessage});
            
            setErrorMessage(finalMessage);
            const newError = new Error(finalMessage);
            throw newError;
        }

    }

    return {
        errorMessage,
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