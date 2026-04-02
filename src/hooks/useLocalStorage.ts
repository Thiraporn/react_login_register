import { useState, useEffect } from "react";

const getLocalStorage = (key, initValue) => {

    //SSR Next JS
    if (typeof window === 'undefined') return initValue;
     
    const persist = JSON.parse(localStorage.getItem('persist') || 'false'); 
    // ❗ ถ้า persist = false → ห้ามอ่าน key อื่น
    if (persist === false && key !== 'persist') {
        return initValue;
    }  
    // undefined
    if (localStorage.getItem(key) === 'undefined') return initValue;
    // empty string 
    if (isEmpty(localStorage.getItem(key))) return initValue;

    //Value already stored 
    const localValue = localStorage.getItem(key);
    //JSON.parse(localStorage.getItem(key)); 
    if (isEmpty(localValue)) return initValue;

    // if localValue is not empty string, not undefined and not null
    if (null !== localValue && 'undefined' !== localValue) return JSON.parse(localValue);


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
            localStorage.setItem(key, JSON.stringify(value)); 
            // 🔴 check persist จาก localStorage
            const persist = JSON.parse(localStorage.getItem('persist') || 'false');

            // ❗ ถ้า persist = false → ไม่ต้อง set key อื่น
            if (persist === false && key !== 'persist') {
                Object.keys(localStorage).forEach(k => {
                        if (k !== 'persist') {
                            localStorage.setItem(k, JSON.stringify(initValue));
                        }
                    });
                localStorage.setItem('persist', JSON.stringify(persist)); 
                return;
            }
 
    }, [key, value]);

 


    return [value, setValue];


}
const isEmpty = (value) => {
    // null หรือ undefined
    if (null == value) return true;

    // string
    if (typeof value === "string") return value.trim().length === 0;

    // number
    if (typeof value === "number") return Number.isNaN(value);

    // array
    if (Array.isArray(value)) return value.length === 0;

    // object
    if (typeof value === "object") return Object.keys(value).length === 0;

    return false;
};

export default useLocalStorage;