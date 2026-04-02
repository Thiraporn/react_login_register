import useLocalStorage from "./useLocalStorage";

export const useToggle = (key, initValue) => {
    // 1. Get initial state from localStorage if it exists
    const [value, setValue] = useLocalStorage(key, initValue);
   // 2. The toggle function
    const toggle = (value) => {
        
        setValue(prev => {
            const next = typeof value === 'boolean' ? value : !prev;  
            return next;
        }) 
       
    }
    return [value, toggle];

}
export default useToggle;