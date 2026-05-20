import axios from "@/api/axios";
import useAuth from '@/hooks/useAuth';

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async()=>{
        //setAuth({});
        try {
            const response = await axios('/sign-out',
                {withCredentials: true}
            );
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // เคลียร์ auth state
            setAuth({
                user: null,
                accessToken: null,
            });
            //Clear auth data from sessionStorage
            sessionStorage.clear();
        }
    }

    return logout;

}
export default useLogout;