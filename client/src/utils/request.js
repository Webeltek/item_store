
const request = async ( method ,url,data ) =>{
    let options = {};

//TODO remove credentials: "include" ( authentication with httpOnly cookie) and replace with X-Authorization header
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

    
    const response = await fetch(url, options);
    const result = await response.json();
    return result;

}

export default {
    //get : (...params)=> request('GET',...params)
    get: request.bind(null, 'GET'),
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT'),
    delete: request.bind(null, 'DELETE')
}