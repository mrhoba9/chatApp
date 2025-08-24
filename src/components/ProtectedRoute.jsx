import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/auth.js";
import Loading from "./Loading.jsx";

export default function ProtectedRoute({ children, requiresAuth }) {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        (async () => {
            const auth = await checkAuth();
            setIsAuth(auth);
        })();
    }, []);

    if (isAuth === null) return <Loading />;

    // If route requires login but user is not logged in
    if (requiresAuth && !isAuth) return <Navigate to="/login" replace />;

    // If route requires logout but user is logged in
    if (!requiresAuth && isAuth) return <Navigate to="/dashboard" replace />;

    return children;
}