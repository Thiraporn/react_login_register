import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Logo
  , MenuLinks
  , MenuResponsive
  , MobileMenu
  , User
} from "../ui-elements";
import { getColor, getIcon } from "@/utils";
type Props = {
  menus: any[];
};
//export const Navbar = () => {
export const Navbar = ({ menus }: Props) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mappedMenus = menus.filter((group: any) => group.groupCode !== "MANAGEMENT").map((group: any) => ({
    code: group.code,
    name: group.nameEN,
    subLinks: group.children?.map((child: any) => ({
      code: child.code,
      name: child.nameEN,
      description: child.description,
      link: child.url,
      icon: getIcon(child.icon),
      color: getColor(child.color),
    })) || [],
  }));

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="dark flex items-center h-16 px-3 m-0 md:px-4 dark:bg-gray-900 bg-gray-50 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between w-full md:mx-4 lg:mx-8 2xl:w-[80em] 2xl:mx-auto">
          <div className="flex items-center justify-center">
            <div className="md:hidden">
              <MenuResponsive
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
            <div className="hidden md:block">
              <Logo />
            </div>
            <div className="relative hidden ml-4 text-gray-600 top-[1px] md:block">
              <MenuLinks menuLinks={mappedMenus} />
            </div>
          </div>
          <div className="absolute z-50 block transform -translate-x-1/2 md:hidden left-1/2">
            <Logo />
          </div>
          <div className="flex items-center justify-center gap-4">
            <User />
          </div>
        </div>
        <div className="md:hidden">
          {isMobileMenuOpen && <MobileMenu menuLinks={mappedMenus} />}
        </div>
      </nav>
    </>
  )
}
export default Navbar