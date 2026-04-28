import axiosPrivate from "@/api/axios";
import useAuth from '@/hooks/useAuth';
//useRefreshToken (ตัว “ไปเอา token ใหม่”) 
const useRefreshToken = () => {
    const { setAuth } = useAuth();
    
    const refresh = async () => {
        const response = await axiosPrivate.post('/refreshToken', {//ยิงไป backend /refreshToken
            withCredentials: true
        });
        setAuth( prev =>{//backend ใช้ refreshToken (ใน cookie) --->  accessToken ใหม่ && roles ใหม่
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {...prev
                ,roles: response.data.roles
                ,accessToken:response.data.accessToken}
        });
        return response.data.accessToken;
    }

    return  refresh;
}

export default useRefreshToken