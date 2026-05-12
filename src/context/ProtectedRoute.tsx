import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "@/hooks";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({
  children,
}: Props) => {

  const {
    permissions,
    menus,
    loading,
  } = useAuth();
  const location = useLocation();

  // loading auth/menu
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // flatten menus
  const allMenus =
    menus.flatMap((g) => g.children);

  //  user has NO permissions at all
  if (allMenus.length === 0) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // find current menu
  const currentMenu =
    allMenus.find(
      (m) =>
        m.url === location.pathname
    );

  // route not registered in menu
  if (!currentMenu) {
    return (
      <Navigate
        to="/Page404"
        replace
      />
    );
  }

  const requiredPermissions =
    currentMenu.requiredPermissions || [];

  // no permission required
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // permission check
  const hasAccess =
    requiredPermissions.some((p) =>
      permissions.includes(p)
    );

  // no access
  if (!hasAccess) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// import { useAuth } from "@/hooks";
// import { Navigate } from "react-router-dom";

// type Props = {
//   permissions?: string[];
//   requiredPermissions?: string[];
//   children: React.ReactNode;
// };

// const ProtectedRoute = ({
//   permissions = [],
//   requiredPermissions = [],
//   children,
// }: Props) => {

//   const { loading } = useAuth();

//   if (loading) return null;


//   // no permission required → allow access
//   if (!requiredPermissions || requiredPermissions.length === 0) {
//     return <>{children}</>;
//   }
//   // check access
//   const hasAccess = requiredPermissions.some((p) =>
//     permissions.includes(p)
//   );


//   if (!hasAccess) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         replace
//       />
//     );
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;