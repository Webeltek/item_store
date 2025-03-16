import request from "../utils/request"

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = `${apiUrl}/items`;

export default {
    getAll(){
        return request.get(baseUrl);
    },
    getLatest(limit){
        return request.get(`${baseUrl}/latest?limit=${limit}`)
    },
    getOne(itemId){
        return request.get(`${baseUrl}/${itemId}`);
    },
    create(data){
        return request.post(baseUrl, data);
    },
    getOwned(){
        return request.getAuth(`${baseUrl}/owned`);
    },
    getOrdered(){
        return request.getAuth(`${baseUrl}/ordered`);
    }
}