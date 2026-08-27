import React from "react";

function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem("nexserve_token");
    const userData = localStorage.getItem("nexserve_user");

    if (!token || !userData) {
        window.location.href = "/login";
        return null;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch {
        localStorage.removeItem("nexserve_token");
        localStorage.removeItem("nexserve_user");
        window.location.href = "/login";
        return null;
    }

    if (allowedRole && user.role !== allowedRole) {
        if (user.role === "worker") {
            window.location.href = "/worker";
        } else {
            window.location.href = "/customer";
        }

        return null;
    }

    return children;
}

export default ProtectedRoute;