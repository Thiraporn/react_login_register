import { ReactNode } from "react"; 
import { MenuGroup } from "@/types/menu";

export type AuthType = {
  user: string | null; 
  accessToken: string | null;
};  
export type AuthContextType = {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
  permissions: string[];
  menus: MenuGroup[];
  setPermissions: React.Dispatch<React.SetStateAction<string[]>>;
  setMenus: React.Dispatch<React.SetStateAction<MenuGroup[]>>;
  initializeAuthorized: (accessToken: string) => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export type Props = {
  children: ReactNode;
};