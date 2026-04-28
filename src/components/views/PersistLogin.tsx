import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '@/hooks/useRefreshToken';
import useAuth from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage"; 

 
export const PersistLogin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth(); 
    const [persist] = useLocalStorage('persist',false)
    // refresh จะเกิด 2 กรณีหลัก:
    //1) ตอนเข้าเว็บ (PersistLogin)
    //2) ตอนยิง API แล้วโดน 403 (token หมดอายุ)
    
    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                const accessToken = await refresh();
                console.log("ACCESS TOKEN after refresh:", accessToken);

            } catch (error: any) {
                console.log(error); 
                console.log("No valid session");
                // console.log(" ERROR INTERCEPTED:", error?.response?.status);
                // const status = error?.response?.status;
                // const message = error?.response?.data?.message;
                // const code = error?.response?.data?.code;
                //navigate("/login", { replace: true });
                 
                if (error?.response?.status === 401 ||
                    error?.response?.status === 403) {
                     navigate("/Unauthorized", { replace: true });
                }
                // if (error?.response?.status === 500) {
                //     // Handle 500 Internal Server Error
                //     console.error("Internal Server Error:", error?.response?.data);
                //     //alert("An unexpected error occurred. Please try again later.");
                //     navigate("/Page500", { replace: true });
                // }
                // if (error?.response?.status === 404) {
                //     // Handle 404 Not Found
                //     console.error("Resource Not Found:", error?.response?.data);
                //     //alert("The requested resource was not found.");
                //     navigate("/Page404", { replace: true });
                // }

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

 