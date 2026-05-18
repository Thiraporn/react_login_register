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

export type Role = {
  id: string;
  code: string;
  name: string; // USER, ADMIN
};

export type Permission = {
  roleCode: string;
  menuCode: string;
  enabled: boolean
};
