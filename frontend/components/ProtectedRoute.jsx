import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRole }) {

    const {
        user,
        token,
        loading
    } = useAuth();


    // ======================================================
    // WAIT FOR AUTH RESTORATION
    // ======================================================

    if (loading) {
        return (
            <div className="auth-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }


    // ======================================================
    // NOT AUTHENTICATED
    // ======================================================

    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================================
    // ROLE CHECK
    // ======================================================

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        if (user.role === "worker") {
            return (
                <Navigate
                    to="/worker/dashboard"
                    replace
                />
            );
        }


        if (user.role === "customer") {
            return (
                <Navigate
                    to="/customer/home"
                    replace
                />
            );
        }


        // Unknown role
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================================
    // AUTHORIZED
    // ======================================================

    return <Outlet />;
}

export default ProtectedRoute;