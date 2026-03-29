import { useContext, useDebugValue } from "react";
import AuthContext from "@/context/AuthProvider";
 

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Must be inside provider");
    }

    useDebugValue(
        context.auth,
        auth => auth.user ? "Logged In" : "Logged Out"
    );

    return context;
}
export default useAuth;