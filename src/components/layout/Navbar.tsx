import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
   Logo
  , MenuLinks
  , MenuResponsive 
  , MobileMenu
  , User
} from "../ui-elements";
import { navigationLinks } from "./navigation-links";
export const Navbar = () => {
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <MenuLinks menuLinks={navigationLinks} />
            </div>
          </div>
          <div className="absolute block transform -translate-x-1/2 md:hidden left-1/2">
            <Logo />
          </div>
          <div className="flex items-center justify-center gap-4"> 
            <User />
          </div>  
        </div>
        <div className="md:hidden">
          {isMobileMenuOpen && <MobileMenu menuLinks={navigationLinks} />}
        </div>
      </nav>
    </>
  )
}
export default Navbar