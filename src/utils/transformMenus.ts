import { ICON_MAP } from "@/components/IconPicker";
import { Info  } from "lucide-react";
import React from "react";

 

export const flattenMenus = (menus: any[]) => {
  let result: any[] = [];

  const walk = (item: any) => {
    if (item.url) result.push(item);
    if (item.children?.length) {
      item.children.forEach(walk);
    }
  };

  (menus ?? []).forEach(walk); // safe

  return result;
};


 export const COLORS = [
    "bg-indigo-300 dark:bg-indigo-800",
    "bg-fuchsia-300 dark:bg-fuchsia-800",
    "bg-teal-300 dark:bg-teal-800",
    "bg-amber-300 dark:bg-amber-800",
    "bg-emerald-300 dark:bg-emerald-700" ,
    "bg-yellow-300 dark:bg-yellow-700" ,
    "bg-green-100 dark:bg-yellow-700"  
  ];

  export const getColor = (menu) => {
    if (menu || menu) {
      return `${(menu || menu).trim()}`;
    }
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  export const getIcon = (key) => {
    const Icon = ICON_MAP[key] || Info;
    return React.createElement(Icon);
  };
  