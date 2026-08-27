import { useEffect, useState } from "react";
import api from "../services/api";

export default function WorkerNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/notifications");

            setNotifications(
                response?.notifications ||
                response?.data?.notifications ||
                response?.data ||
                []
            );
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        WORKER
                    </span>

                    <h1>Notifications</h1>

                    <p>
                        Job requests and important updates.
                    </p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={loadNotifications}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="empty-state">
                    <h2>No notifications</h2>
                    <p>
                        New job requests will appear here.
                    </p>
                </div>
            ) : (
                <div className="notification-list">

                    {notifications.map(
                        (notification, index) => (
                            <div
                                className={
                                    notification.read
                                        ? "notification-item"
                                        : "notification-item unread"
                                }
                                key={
                                    notification._id ||
                                    notification.id ||
                                    index
                                }
                            >

                                <div className="notification-icon">
                                    🔔
                                </div>

                                <div className="notification-content">

                                    <strong>
                                        {notification.title ||
                                            "New Notification"}
                                    </strong>

                                    <p>
                                        {notification.message ||
                                            notification.text ||
                                            "You have a new update."}
                                    </p>

                                    <span className="notification-time">
                                        {notification.createdAt
                                            ? new Date(
                                                  notification.createdAt
                                              ).toLocaleString()
                                            : ""}
                                    </span>

                                </div>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}