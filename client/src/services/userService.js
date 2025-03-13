const baseUrl = 'http://localhost:3100/api';

export default {
    async login(email,password){
        try {
            const response = await fetch(`${baseUrl}/login`,{
                credentials: "include",
                method: 'post',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });
            if(!response.ok){
                const err = await response.json();
                throw new Error(err.message);
            }
            if(response.status == 204){
                return response;
            } else {
                return response.json();
            }
        } catch (err) {
            alert(err.message);
            throw err;
        }
    },
    async register(username, email,password, rePassword){
        try {
            const response = await fetch(`${baseUrl}/register`,{
                credentials: "include",
                method: 'post',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password, rePassword})
            });
            if(!response.ok){
                const err = await response.json();
                throw new Error(err.message);
            }
            if(response.status == 204){
                return response;
            } else {
                return response.json();
            }
        } catch (err) {
            alert(err.message);
            throw err;
        }
    }
}