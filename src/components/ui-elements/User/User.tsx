import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLogout from "@/hooks/useLogout";
import { JSX, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks";
import { getColor, getIcon } from "@/utils";
type Item = {
  title: string;
  icon: JSX.Element;
  color: string;
  link?: string;
  onclick?: () => void;
};
export const User = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const { menus } = useAuth();


  const signOut = async () => {
    //if use more components, this should be in context
    //axios to => logout endpoint
    await logout();
    navigate("/login");
  };

  const ms = new Date().getUTCMilliseconds();

  // const [theme, setTheme] = useState(localStorage.getItem("theme"));
  // // const onChangeThemeClick = () => {
  // //   const newTheme = theme === "light" ? "dark" : "light";
  // //   setTheme(newTheme);

  // //   if (newTheme === "dark") {
  // //     document.documentElement.classList.remove("light");
  // //     document.documentElement.classList.add("dark");
  // //   } else {
  // //     document.documentElement.classList.remove("dark");
  // //     document.documentElement.classList.add("light");
  // //   }
  // // };

  const systemLogoutItem: Item = {
    title: "Logout",
    icon: <LogOut />,
    color: "bg-red-300 dark:bg-red-800",
    onclick: signOut,
  };
  const [items, setItems] = useState<Item[]>([]);

  const mapMenusToItems = (menus) => {
    if (!Array.isArray(menus)) return [];

    return menus
      .filter((group: any) => group?.groupCode === "MANAGEMENT")
      .flatMap((group: any) => group.children ?? [])
      .map((menu: any) => ({
        title: menu.nameEN,
        icon: getIcon(menu.icon),
        color: getColor(menu.color),
        link: menu.url,
      }));
  };

  useEffect(() => {
    const mapped = mapMenusToItems(menus);
    setItems([...(Array.isArray(mapped) ? mapped : []), systemLogoutItem]);
  }, [menus]);


  return (
    <div className="relative group">
      <div className="flex items-center h-10 gap-3 rounded-lg cursor-pointer w-fit hover:bg-slate-200 dark:hover:bg-slate-800">
        <img
          src={`https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${ms}`}
          className="my-auto ml-3 rounded-full w-7 h-7"
        />
        <p className="mr-3 font-bold text-gray-800 dark:text-gray-200">
          {auth?.user ? auth.user.toUpperCase() : "GUEST"}
        </p>
      </div>
      {/* <ul className="absolute z-50 w-72 p-2 bg-slate-50 dark:bg-gray-900 shadow-[rgba(0,_0,_0,_0.24)_0px_0px_40px] shadow-slate-400 dark:shadow-slate-700 hidden md:group-hover:flex flex-col -left-[8em] rounded-xl "> */}
      <ul
        className="  absolute z-50 w-72 p-2 bg-slate-50 dark:bg-gray-900
                shadow-[rgba(0,_0,_0,_0.24)_0px_0px_40px]
                shadow-slate-400 dark:shadow-slate-700
                flex flex-col
                left-[-8em] rounded-xl

                opacity-0 invisible pointer-events-none
                group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto
                transition-all duration-200"
      >
        {items.map((item) => (
          <li
            key={item.title}
            className="flex items-center justify-start h-16 font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
          //onClick={item.onclick}
          >
            {item.link ? (
              <Link
                to={item.link}
                className="flex items-center justify-start h-16 font-bold 
                 hover:bg-slate-200 dark:hover:bg-slate-800 
                 rounded-xl w-full"
              >
                <div
                  className={`h-10 w-10 ml-5 flex items-center justify-center rounded-lg ${item.color}`}
                >
                  <div className="w-3/5 text-gray-800 h-3/5 dark:text-gray-200">
                    {item.icon}
                  </div>
                </div>
                <p className="ml-5 text-gray-600 dark:text-gray-200">
                  {item.title}
                </p>
              </Link>
            ) : (
              <button
                onClick={item.onclick}
                className="flex items-center w-full h-full text-left"
              >
                <div
                  className={`h-10 w-10 ml-5 flex items-center justify-center rounded-lg ${item.color}`}
                >
                  {item.icon}
                </div>

                <p className="ml-5 text-gray-600 dark:text-gray-200">
                  {item.title}
                </p>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
