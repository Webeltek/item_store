import { useEffect, useRef } from "react";
import request from "../utils/request";

const baseUrl = import.meta.env.VITE_API_URL;

export const useLogin = () => {
    const abortRef = useRef(new AbortController());

    const login = async (email, password) => {
        return request.post(
            `${baseUrl}/login`, 
            {email, password}, 
            { signal: abortRef.current.signal}
        );
    }

    useEffect(() => {
        const abortController = abortRef.current;
        return  () => abortController.abort();
    },[]);

    return { login }
}
