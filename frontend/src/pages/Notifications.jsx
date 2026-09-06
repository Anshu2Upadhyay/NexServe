import {
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Job Accepted",
      message:
        "Amit Sharma has accepted your Bathroom Pipe Repair job.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Worker On The Way",
      message:
        "Your assigned worker has started travelling to your location.",
      time: "25 minutes ago",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Job Completed",
      message:
        "Your Electrical Wiring job has been marked as completed.",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "warning",
      title: "Payment Pending",
      message:
        "Payment for your completed job is waiting for confirmation.",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 5,
      type: "info",
      title: "New Job Available",
      message:
        "A plumbing job matching your service area is available.",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 6,
      type: "success",
      title: "Worker Verified",
      message:
        "Your worker profile verification has been successfully completed.",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter(
    (notification) => {
      if (filter === "Unread") {
        return !notification.read;
      }

      if (filter === "Read") {
        return notification.read;
      }

      return true;
    }
  );

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const getIcon = (type) => {
    if (type === "success") {
      return <CheckCircle2 size={16} />;
    }

    if (type === "warning") {
      return <Clock3 size={16} />;
    }

    return <Info size={16} />;
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="dashboard-content">
          <section className="page-heading-row">
            <div>
              <span className="page-eyebrow">
                NOTIFICATIONS
              </span>

              <h1>Notifications</h1>

              <p>
                Stay updated about your jobs, workers and
                account activity.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                className="notifications-mark-all"
                onClick={markAllAsRead}
              >
                <Check size={13} />
                Mark all as read
              </button>
            )}
          </section>

          <section className="notifications-panel">
            <div className="notifications-toolbar">
              <div className="notifications-heading">
                <div className="notifications-heading-icon">
                  <Bell size={16} />
                </div>

                <div>
                  <strong>
                    Your Notifications
                  </strong>

                  <span>
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount > 1 ? "s" : ""
                        }`
                      : "You're all caught up"}
                  </span>
                </div>
              </div>

              <div className="notifications-filters">
                {["All", "Unread", "Read"].map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      className={
                        filter === item ? "active" : ""
                      }
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="notifications-list">
              {filteredNotifications.length === 0 ? (
                <div className="notifications-empty">
                  <div className="notifications-empty-icon">
                    <Bell size={22} />
                  </div>

                  <strong>
                    No notifications
                  </strong>

                  <span>
                    There are no notifications in this
                    category.
                  </span>
                </div>
              ) : (
                filteredNotifications.map(
                  (notification) => (
                    <div
                      className={`notification-item ${
                        !notification.read
                          ? "unread"
                          : ""
                      }`}
                      key={notification.id}
                    >
                      <div
                        className={`notification-icon ${notification.type}`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      <div className="notification-content">
                        <div className="notification-title-row">
                          <strong>
                            {notification.title}
                          </strong>

                          {!notification.read && (
                            <span className="notification-new">
                              NEW
                            </span>
                          )}
                        </div>

                        <p>
                          {notification.message}
                        </p>

                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>

                      <div className="notification-actions">
                        {!notification.read && (
                          <button
                            type="button"
                            title="Mark as read"
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            <Check size={13} />
                          </button>
                        )}

                        <button
                          type="button"
                          title="Delete notification"
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          <section className="notification-info-card">
            <div className="notification-info-icon">
              <MapPin size={16} />
            </div>

            <div>
              <strong>
                Real-time job updates
              </strong>

              <span>
                You'll receive updates when a worker
                accepts your job, starts travelling, or
                completes the service.
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Notifications;