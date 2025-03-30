import { createContext } from "react";

export const UserContext = createContext({
    errorMessage: '',
    _id: '',
    email: '',
    username: '',
    accessToken: '',
    userLoginHandler: ()=> null,
    userLogoutHandler: () => null,
    showErrorMsg: ()=> null,
})