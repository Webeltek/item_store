import { useState } from "react"
import { useDispatch } from 'react-redux'
import { setUser } from "../redux/slices/userSlice";

 export default function usePersistedState(stateKey, initialState){
    const dispatch = useDispatch()
    const [ state, setState] = useState(() => {
        const persistedStateJSON = localStorage.getItem(stateKey);
        if(!persistedStateJSON) {
            return typeof initialState === 'function' 
            ? initialState() 
            : initialState ;
        }

        const persistedStateData = JSON.parse(persistedStateJSON);
        const { accessToken, ...user } = persistedStateData;
        
        dispatch(setUser(user))
        return persistedStateData;
    });

    const setPersistedState = (input) => {
        const data = typeof input === 'function' 
        ? input(state) 
        : input ;

        const persistedData = JSON.stringify(data);
        localStorage.setItem(stateKey, persistedData);

        setState(data);
        const { accessToken, ...user} = data;
        //testing userSlice from redux toolkit
        dispatch(setUser(user));
    }

    return [
        state,
        setPersistedState
    ]
 }