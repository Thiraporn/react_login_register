import axiosPrivate from "@/api/axios";
import { AuthContextType, AuthType, MenuGroup } from "@/types";
import { createContext, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState<AuthType>({
    user: null,
    accessToken: null,
  });
  //const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [menus, setMenus] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const initializeAuthorized = async (
    accessToken: string
  ) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const [currentMeResponse, permissionsResponse, menuResponse,] = await Promise.all([
        axiosPrivate.get("/user/me", config),
        axiosPrivate.get("/permissions/me", config),
        axiosPrivate.get("/permissions/get-permissions", config),
      ]);

      setAuth({ user: currentMeResponse.data.username, accessToken });
      setPermissions(permissionsResponse.data?.roles ?? []);
      //setPermissions(Array.isArray(permissionsResponse.data.roles) ? permissionsResponse.data.roles : []);
      setMenus(menuResponse.data);
      // console.log("ROLE FULL DATA >>>", permissionsResponse.data);
      // console.log("MENU FULL DATA >>>", menuResponse.data);

    } catch (err) {
      console.error("initializeAuthorized error", err)
      setPermissions([]);
      setMenus([]);
    }
    finally {
      console.log("initializeAuthorized FORCE STOP LOADING");
      setLoading(false);
    };
  };


  return (
    // <AuthContext.Provider value={{ auth, setAuth,persist,setPersist }}>
    <AuthContext.Provider value={{ auth, setAuth, permissions, menus, setPermissions, setMenus, initializeAuthorized, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
