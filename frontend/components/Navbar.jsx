import React from "react";

function Navbar({ user, onLogout }) {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">N</div>

                <div className="navbar-brand">
                    <h2>NexServe</h2>
                    <span>Local services. simplified.</span>
                </div>
            </div>

            <div className="navbar-right">
                {user && (
                    <div className="navbar-user">
                        <div className="navbar-avatar">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="navbar-user-info">
                            <strong>{user.name}</strong>
                            <span>
                                {user.role === "worker"
                                    ? "Worker"
                                    : "Customer"}
                            </span>
                        </div>
                    </div>
                )}

                {onLogout && (
                    <button
                        type="button"
                        className="logout-button"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}

export default Navbar;