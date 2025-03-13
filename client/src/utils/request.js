
const request = async (hasCredential, method ,url,data ) =>{
    let options = {};

    if(hasCredential){
        options = {
            credentials: "include"
        }
    }

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
    get: request.bind(null,false, 'GET'),
    post: request.bind(null, true, 'POST'),
    put: request.bind(null, true, 'PUT'),
    delete: request.bind(null, true, 'DELETE')
}