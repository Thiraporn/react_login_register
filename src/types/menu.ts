import { JSX } from "react";   
export  type MenuGroup = {
  code: string;
  nameEN: string;
  description?: string;
  icon: JSX.Element
  color?: string;
  groupCode?: string;
  children: MenuItem[];
};

export type MenuItem = {
  code: string;
  nameEN: string;
  description?: string;
  url: string;
  icon: JSX.Element
  color?: string;
  groupCode?: string;
  requiredPermissions?: string[];

};