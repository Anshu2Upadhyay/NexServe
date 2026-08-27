import React from "react";

function StatusBadge({ status }) {
    const statusConfig = {
        posted: {
            label: "Finding Worker",
            className: "status-posted"
        },
        accepted: {
            label: "Worker Accepted",
            className: "status-accepted"
        },
        traveling: {
            label: "Worker On The Way",
            className: "status-traveling"
        },
        arrived: {
            label: "Worker Arrived",
            className: "status-arrived"
        },
        in_progress: {
            label: "Work In Progress",
            className: "status-progress"
        },
        waiting_payment: {
            label: "Payment Required",
            className: "status-payment"
        },
        completed: {
            label: "Completed",
            className: "status-completed"
        },
        cancelled: {
            label: "Cancelled",
            className: "status-cancelled"
        }
    };

    const current =
        statusConfig[status] || {
            label: status
                ? status.replaceAll("_", " ")
                : "Processing",
            className: "status-default"
        };

    return (
        <span
            className={`status-badge ${current.className}`}
        >
            <span className="status-dot"></span>
            {current.label}
        </span>
    );
}

export default StatusBadge;