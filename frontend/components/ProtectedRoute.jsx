import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
    const token =
        localStorage.getItem("nexserve_token");

    const userData =
        localStorage.getItem("nexserve_user");

    if (!token || !userData) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch {
        localStorage.removeItem(
            "nexserve_token"
        );

        localStorage.removeItem(
            "nexserve_user"
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        allowedRole &&
        user?.role !== allowedRole
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
                to="/customer/home"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;