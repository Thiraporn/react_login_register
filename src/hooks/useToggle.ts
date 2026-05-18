import useLocalStorage from "./useLocalStorage";

export const useToggle = (key, initValue) => {
    // 1. Get initial state from localStorage if it exists
    const [value, setValue] = useLocalStorage(key, initValue);
    // 2. The toggle function
    const toggle = (nextValue?: boolean) => {
    setValue((prev: boolean) => {
        const next =
            typeof nextValue === "boolean" ? nextValue : !prev;

        console.log("TOGGLE", key, "=>", next);
        return next;
        });
    };

    return [value, toggle] ;
 

}
export default useToggle;