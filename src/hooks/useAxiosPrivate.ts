import { axiosPrivate } from  '@/api/axios';
import { useEffect } from "react";
import useRefreshToken from '@/hooks/useRefreshToken';
import useAuth from '@/hooks/useAuth'; 
import { useNavigate } from 'react-router'; 

//useAxiosPrivate (ตัว “กัน token หมดอายุ”)
const useAxiosPrivate = () => {
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    //const auth = useAuth();
    const { auth } = useAuth();
    useEffect(() => {
        // ======================
        // REQUEST: ใส่ token ทุกหน้า
        // ======================
        //Request interceptor
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {//ทุก request จะ “แปะ token อัตโนมัติ”
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;

                }
                return config;
            }, (error) =>  Promise.reject(error)  );
       
        // ======================
        // RESPONSE: global error handler
        // ======================
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config; 
                console.log(" ERROR INTERCEPTED:", error?.response?.status);
                const status = error?.response?.status; 
 

                // refresh จะเกิด 2 กรณีหลัก:
                //1) ตอนเข้าเว็บ (PersistLogin)
                //2) ตอนยิง API แล้วโดน 403 (token หมดอายุ)
               
                // TOKEN EXPIRED → refresh + retry
                // =========================
                // 🟡 CASE : token หมดอายุ
                // ========================= 
                if ((status === 401 || status === 403)   &&  !prevRequest.sent) { 
                //if (status === 403 && !prevRequest?.sent) {//Response interceptor ===> ยิง API แล้ว server ตอบ 403 (token expired / invalid)
                    //    ถ้า API ตอบกลับ 403 (token ใช้ไม่ได้แล้ว)
                    //    จะเรียก refresh()
                    //    แล้ว retry request เดิมใหม่อัตโนมัติ
                    prevRequest.sent = true;  //ป้องกัน loop: ถ้า refresh แล้วก็ยังโดน 403 (token ใช้ไม่ได้แล้ว) → จะไม่เรียก refresh ซ้ำอีก
                  try {
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                 } catch (err: any) {
                        console.log("REFRESH FAIL:", err?.response?.status);
                        console.log("REFRESH DATA:", err?.response?.data);
                        //sessionStorage.setItem("lastPath", window.location.pathname);
                        // เก็บ path เฉพาะตอนที่ไม่ใช่ login
                        if (window.location.pathname !== "/login" && window.location.pathname !== "/Unauthorized") {
                            sessionStorage.setItem("lastPath", window.location.pathname);
                        }
                        navigate("/login");
                        return Promise.reject(err);
                    }
                }
                 
                const code = error?.response?.data?.code;
                // =========================
                // 🔴 NO REFRESH TOKEN
                // =========================
                if (status === 401 && code === "REFRESH_TOKEN_EMPTY") {
                    navigate("/login");
                    return Promise.reject(error);
                }

                // =========================
                // 🔴 INVALID TOKEN
                // =========================
                if (status === 401 && code === "INVALID_TOKEN") {
                    navigate("/login");
                    return Promise.reject(error);
                }

                // =========================
                // 🟣 TOKEN REUSE (โดนขโมย)
                // =========================
                if (status === 403 && code === "TOKEN_REUSE") {
                    alert("Session compromised. Please login again.");
                    navigate("/login", { replace: true });
                    return Promise.reject(error);
                } 

                // =========================
                // 💥 server error
                // =========================
                if (status === 500) {
                    navigate("/Page500");
                }
                

                return Promise.reject(error);

            });

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    }, [auth, refresh]);
    return axiosPrivate;
}
export default useAxiosPrivate;