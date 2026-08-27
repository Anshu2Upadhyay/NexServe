import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ role }) {

    const {
        user,
        loading,
        isAuthenticated
    } = useAuth();


    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
                <p>Loading...</p>
            </div>
        );
    }


    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (
        role &&
        user?.role !== role
    ) {

        if (user?.role === "worker") {
            return (
                <Navigate
                    to="/worker/dashboard"
                    replace
                />
            );
        }


        return (
            <Navigate
                to="/customer/dashboard"
                replace
            />
        );
    }


    return <Outlet />;
}


export default ProtectedRoute;