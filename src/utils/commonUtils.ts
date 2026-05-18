export const toPascalCaseUrl = (
  str: string = ""
): string => { 
  const pascalCase = str
    .trim()  
    .replace(/[^a-zA-Z0-9\s]/g, " ") // เอา special char ออก เหลือแค่ a-z A-Z 0-9 space 
    .split(/\s+/)// split ทุก space  
    .map(// capitalize
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)//.toLowerCase()
    )  
    .join("");// join ไม่มี space

  return   pascalCase ? `/${pascalCase}` : "";
};
export const toUpperCaseNoSpace = (
  str: string = ""
) => {
  return str
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
};