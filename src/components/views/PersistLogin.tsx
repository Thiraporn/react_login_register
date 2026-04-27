import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '@/hooks/useRefreshToken';
import useAuth from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage"; 

 
export const PersistLogin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth  } = useAuth();
    //const [persist] = useLocalStorage('persist',false)
    const persist = JSON.parse(localStorage.getItem("persist") || "false"); 
    const emailLogin = JSON.parse(localStorage.getItem("emailLogin") || "false"); 
    console.log("persist  in PersistLogin =", persist);
    console.log("emailLogin  in PersistLogin =", emailLogin);
    //const persist = JSON.parse(localStorage.getItem("persist") || "false");
    // refresh จะเกิด 2 กรณีหลัก:
    //1) ตอนเข้าเว็บ (PersistLogin)
    //2) ตอนยิง API แล้วโดน 403 (token หมดอายุ)
    
    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();

            } catch (error: any) {
                console.log(error); 
                // console.log(" ERROR INTERCEPTED:", error?.response?.status);
                // const status = error?.response?.status;
                // const message = error?.response?.data?.message;
                // const code = error?.response?.data?.code;
                //navigate("/login", { replace: true });
                 
                if (error?.response?.status === 401 ||
                    error?.response?.status === 403) {
                     navigate("/login", { replace: true });
                }
                //return Promise.reject(error);
            } finally {
               isMounted && setIsLoading(false);
            }
        }
        //ถ้ายังไม่มี accessToken → จะเรียก refresh()
        //เพื่อ “ขอ accessToken ใหม่ตอนเปิดเว็บ”
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
        };

    }, []);


    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`@@@@====>: ${JSON.stringify(auth?.accessToken)}`);

    }, [isLoading]);

    return (
        // <>
        //     {!persist 
        //     ? <Outlet />
        //     : isLoading
        //         ? <p>Loading...</p>
        //         : <Outlet />
        //     }
        // </>

        <>
    {!persist ? (
        <Outlet />
                ) : isLoading ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                        <div className="bg-white px-6 py-5 rounded-2xl shadow-xl flex items-center gap-3">
                            
                            {/* spinner */}
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

                            <span className="text-gray-700 font-medium">
                                Loading authentication...
                            </span>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </>
    );


}

 