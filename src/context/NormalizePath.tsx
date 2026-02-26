import { useLocation, Navigate } from "react-router-dom";

const NormalizePath = () => {
    const location = useLocation(); 
    const normalizedPath = location.pathname.replace(/\/+/g, "/");

    if (location.pathname !== normalizedPath) {
        return <Navigate to={normalizedPath} replace />;
    }

    return null;
};
export default NormalizePath;