import { useState } from "react"

 export default function usePersistedState(stateKey, initialState){
    const [ state, setState] = useState(() => {
        const persistedStateJSON = localStorage.getItem(stateKey);
        if(!persistedStateJSON) {
            return typeof initialState === 'function' 
            ? initialState() 
            : initialState ;
        }

        const persistedStateData = JSON.parse(persistedStateJSON);

        return persistedStateData;
    });

    const setPersistedState = (input) => {
        const data = typeof input === 'function' 
        ? input(state) 
        : input ;

        const persistedData = JSON.stringify(data);
        localStorage.setItem(stateKey, persistedData);

        setState(data);
    }

    return [
        state,
        setPersistedState
    ]
 }