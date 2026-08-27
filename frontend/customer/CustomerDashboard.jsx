import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerDashboard } from "../services/customerService";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";

function CustomerDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCustomerDashboard();

            if (!response?.success) {
                throw new Error(
                    response?.message || "Unable to load dashboard"
                );
            }

            setDashboard(response.dashboard || response.data || {});
        } catch (err) {
            setError(
                err?.message || "Unable to load customer dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    const jobs = dashboard?.jobs || dashboard?.recentJobs || [];

    const statistics = dashboard?.statistics || {};

    const totalJobs =
        statistics.totalJobs ??
        dashboard?.totalJobs ??
        jobs.length ??
        0;

    const activeJobs =
        statistics.activeJobs ??
        dashboard?.activeJobs ??
        0;

    const completedJobs =
        statistics.completedJobs ??
        dashboard?.completedJobs ??
        0;

    const acceptedJobs =
        statistics.acceptedJobs ??
        dashboard?.acceptedJobs ??
        0;

    const totalSpent =
        statistics.totalSpent ??
        dashboard?.totalSpent ??
        dashboard?.spent ??
        0;

    const formatMoney = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    const getJobStatus = (job) => {
        return job?.status || "posted";
    };

    const getStatusLabel = (status) => {
        const labels = {
            posted: "Waiting for worker",
            accepted: "Worker accepted",
            traveling: "Worker on the way",
            arrived: "Worker arrived",
            in_progress: "In progress",
            waiting_payment: "Payment pending",
            completed: "Completed",
            cancelled: "Cancelled"
        };

        return labels[status] || status;
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="page-eyebrow">
                        NEXSERVE
                    </span>

                    <h1>Customer Dashboard</h1>

                    <p>
                        Manage your service requests and
                        track your spending.
                    </p>
                </div>

                <button
                    className="primary-button"
                    type="button"
                    onClick={() => navigate("/customer/post-job")}
                >
                    + New Job
                </button>
            </div>

            {error && (
                <div className="error-box">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={loadDashboard}
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="customer-stats">
                <div className="stat-card spending-card">
                    <div className="stat-icon">₹</div>

                    <div>
                        <span>Total Spent</span>
                        <strong>
                            {formatMoney(totalSpent)}
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">▣</div>

                    <div>
                        <span>Total Jobs</span>
                        <strong>{totalJobs}</strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">◷</div>

                    <div>
                        <span>Active Jobs</span>
                        <strong>{activeJobs}</strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✓</div>

                    <div>
                        <span>Completed</span>
                        <strong>{completedJobs}</strong>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2>Recent Jobs</h2>

                        <p>
                            Your latest service requests
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            navigate("/customer/my-jobs")
                        }
                    >
                        View all →
                    </button>
                </div>

                {jobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ▣
                        </div>

                        <h3>No jobs yet</h3>

                        <p>
                            Need help with something?
                            Post your first job.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate("/customer/post-job")
                            }
                        >
                            Post a Job
                        </button>
                    </div>
                ) : (
                    <div className="job-list">
                        {jobs.slice(0, 6).map((job) => {
                            const status = getJobStatus(job);

                            return (
                                <button
                                    type="button"
                                    className="customer-job-card"
                                    key={job._id || job.id}
                                    onClick={() =>
                                        navigate(
                                            `/customer/job/${job._id || job.id}`
                                        )
                                    }
                                >
                                    <div className="job-main">
                                        <div className="job-title-row">
                                            <h3>
                                                {job.title ||
                                                    "Service Job"}
                                            </h3>

                                            <StatusBadge
                                                status={status}
                                            />
                                        </div>

                                        <p>
                                            {job.description ||
                                                "No description"}
                                        </p>

                                        <div className="job-meta">
                                            <span>
                                                {job.category ||
                                                    "General Service"}
                                            </span>

                                            <span>
                                                {job.area ||
                                                    job.city ||
                                                    "Location unavailable"}
                                            </span>

                                            <span>
                                                {getStatusLabel(
                                                    status
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="job-price">
                                        {job.finalPrice > 0
                                            ? formatMoney(
                                                  job.finalPrice
                                              )
                                            : job.estimatedMinPrice ||
                                                job.estimatedMaxPrice
                                            ? `${formatMoney(
                                                  job.estimatedMinPrice
                                              )} – ${formatMoney(
                                                  job.estimatedMaxPrice
                                              )}`
                                            : "Price pending"}

                                        <span>View details →</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="customer-help-card">
                <div>
                    <span className="page-eyebrow">
                        NEED A SERVICE?
                    </span>

                    <h2>
                        Tell us what you need.
                    </h2>

                    <p>
                        NexServe will find the right local
                        worker for your job.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                        navigate("/customer/post-job")
                    }
                >
                    Post a New Job
                </button>
            </div>
        </div>
    );
}

export default CustomerDashboard;