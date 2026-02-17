import { useState, useEffect } from "react";

const getLocalStorage = (key, initValue) => {
     
    //SSR Next JS
    if (typeof window === 'undefined') return initValue;

    if (localStorage.getItem(key) === 'undefined'  )   return initValue;
           
    //Value already stored 
    const localValue = JSON.parse(localStorage.getItem(key));
    if (localValue) return localValue;


    //return result of a function
    if (initValue instanceof Function) return initValue();
    //otherwise
    return initValue;
}

const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => {
        return getLocalStorage(key, initValue);
    });

    useEffect(() => {
        localStorage.setItem(key,   JSON.stringify(value)) ;
    }, [key, value]);

    return [value, setValue];

}

export default useLocalStorage;