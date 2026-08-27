import React from "react";

function Sidebar({ activePage, setActivePage, role = "customer" }) {
    const customerMenu = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "⌂"
        },
        {
            id: "post-job",
            label: "Post a Job",
            icon: "+"
        },
        {
            id: "my-jobs",
            label: "My Jobs",
            icon: "▣"
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: "◇"
        }
    ];

    const workerMenu = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "⌂"
        },
        {
            id: "available-jobs",
            label: "Available Jobs",
            icon: "▣"
        },
        {
            id: "my-jobs",
            label: "My Jobs",
            icon: "✓"
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: "◇"
        },
        {
            id: "profile",
            label: "My Profile",
            icon: "◯"
        }
    ];

    const menu = role === "worker" ? workerMenu : customerMenu;

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {menu.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`sidebar-item ${
                            activePage === item.id ? "active" : ""
                        }`}
                        onClick={() => setActivePage(item.id)}
                    >
                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span className="sidebar-label">
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="role-badge">
                    <span className="role-dot" />
                    <span>
                        {role === "worker"
                            ? "Worker Account"
                            : "Customer Account"}
                    </span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;