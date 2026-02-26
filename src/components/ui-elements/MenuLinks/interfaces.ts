import { ReactNode } from "react";

export interface MenuLinksProps {
  menuLinks: MenuLinks[];
}

export interface MenuLinks {
  name: string;
  subLinks: SubLink[];
  extraLinks?: ExtraLink[] | undefined;
}

export interface SubLinksBoxProps {
  subLinks: SubLink[];
  extraLinks?: ExtraLink[] | undefined;
}

export interface SubLink {
  name: string;
  description: string;
  link: string;
  color?: string;
  icon: ReactNode;
}

export interface ExtraLink {
  name: string;
  link: string;
}
