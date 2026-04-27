import { createContext, ReactNode, useState } from "react";
type AuthType = {
    user: string | null;
    accessToken: string | null;
};

type AuthContextType = {
    auth: AuthType;
    setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
};
type Props = {
    children: ReactNode;
};
 
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState<AuthType>({
        user: null, accessToken: null,
    });
    //const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    return (
        // <AuthContext.Provider value={{ auth, setAuth,persist,setPersist }}>
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;