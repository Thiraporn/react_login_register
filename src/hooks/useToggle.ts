import useLocalStorage from "./useLocalStorage";

export const useToggle = (key, initValue) => {
    const [value, setValue] = useLocalStorage(key, initValue);

    const toggle = (value) => {
        setValue(prev => {
            return typeof value === 'boolean' ? value : !prev;
        }) 
       
    }
    return [value, toggle];

}
export default useToggle;