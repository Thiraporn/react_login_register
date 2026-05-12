
import { useAuth } from "@/hooks";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export const Container = () => {
  const { menus, loading } = useAuth();
  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
  //       <div className="bg-white px-6 py-5 rounded-2xl shadow-xl flex items-center gap-3">
  //         <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  //         <span className="text-gray-700 font-medium">Loading ...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Navbar menus={menus} />
      <Outlet />
    </>
  )
}
export default Container


