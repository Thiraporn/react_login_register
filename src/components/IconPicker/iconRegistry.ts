//import * as Icons from '@heroicons/react/24/solid';
import * as Icons from "lucide-react";
export const ICON_MAP = Icons; 
export const ICON_KEYS = Object.keys(Icons);
//กรองเอาเฉพาะที่เป็น component จริง
// export const ICON_KEYS = Object.keys(Icons).filter((key) => {
//   const comp = (Icons as any)[key];

//   return (
//     typeof comp === "function" &&   // ต้องเป็น component
//     key !== "createLucideIcon"      // ตัดตัวนี้ทิ้ง
//   );
// });

console.log("ALL Icons :", Object.keys(Icons).length);
console.log(Icons);

 
//export const ICON_KEYS = Object.keys(Icons);