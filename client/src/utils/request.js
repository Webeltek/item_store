
const request = async ( method ,url,data,options = {} ) =>{

// Removed -  credentials: "include" ( authentication with httpOnly cookie) and replaced with X-Authorization header
    // if(hasCredential){
    //     options = {
    //         credentials: "include"
    //     }
    // }

    if(method !== 'GET' ){
        options = {
            ...options,
            method
        }
    }

    if (data) {
        options = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(data)
        }
    }

    try {
        const response = await fetch(url, options);
        if(!response.ok){
            const err = await response.json();
            throw new Error(err.message)
        }
        if(response.status == 204){
            return response;
        } else {
            return response.json();
        }
    } catch (err){
        throw err;
    }



}

export default {
    //get : (...params)=> request('GET',...params)
    get: request.bind(null, 'GET'),
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT'),
    delete: request.bind(null, 'DELETE'),
    baseRequest: request
}