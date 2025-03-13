import request from "../utils/request"

const baseUrl = 'http://localhost:3100/api/items'

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
    }
}