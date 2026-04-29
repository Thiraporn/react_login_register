import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

export const Profile = () => {
  const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.post('/users/all-users', {
                    signal: controller.signal
                });
                const userNames = response.data.map(user => user.username);
                console.log(response.data);
                isMounted && setUsers(userNames);
            } catch (error: any) {
                // console.log(error);
                // navigate('/login', { state: { from: location }, replace: true })
                //console.log("GET USERS ERROR:", error); 
                // if (error?.response?.status === 401 ||
                //     error?.response?.status === 403) {
                //     navigate('/login', { state: { from: location }, replace: true });
                // }

            }
        }
        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        };

    }, []);
  return (

    <main className="h-[calc(100vh-4em)] flex flex-col justify-center items-center">
      <div className="w-[95%] min-h-[80vh] h-[500px] bg-slate-200  rounded-3xl shadow-2xl flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-gray-200">
          Profile Page
        </h1>
      </div>
    </main>

  );
};
