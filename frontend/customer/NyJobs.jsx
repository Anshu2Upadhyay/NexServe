import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerJobs } from "../services/jobService";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";

function MyJobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCustomerJobs();

            if (!response?.success) {
                throw new Error(
                    response?.message || "Unable to load jobs"
                );
            }

            const data =
                response.jobs ||
                response.data?.jobs ||
                response.data ||
                [];

            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.message || "Unable to load your jobs."
            );
        } finally {
            setLoading(false);
        }
    };

    const statusGroups = {
        active: [
            "posted",
            "accepted",
            "traveling",
            "arrived",
            "in_progress",
            "waiting_payment"
        ],
        completed: ["completed"],
        cancelled: ["cancelled"]
    };

    const filteredJobs = jobs.filter((job) => {
        if (filter === "all") return true;

        if (filter === "active") {
            return statusGroups.active.includes(job.status);
        }

        if (filter === "completed") {
            return statusGroups.completed.includes(job.status);
        }

        if (filter === "cancelled") {
            return statusGroups.cancelled.includes(job.status);
        }

        return true;
    });

    const formatMoney = (amount) => {
        return `₹${Number(amount || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    const getPrice = (job) => {
        if (Number(job.finalPrice) > 0) {
            return formatMoney(job.finalPrice);
        }

        if (
            job.estimatedMinPrice ||
            job.estimatedMaxPrice
        ) {
            return `${formatMoney(
                job.estimatedMinPrice
            )} – ${formatMoney(job.estimatedMaxPrice)}`;
        }

        return "Price pending";
    };

    const getStatusText = (status) => {
        const labels = {
            posted: "Finding worker",
            accepted: "Worker accepted",
            traveling: "Worker on the way",
            arrived: "Worker arrived",
            in_progress: "Work in progress",
            waiting_payment: "Payment required",
            completed: "Completed",
            cancelled: "Cancelled"
        };

        return labels[status] || "Processing";
    };

    const formatDate = (date) => {
        if (!date) return "";

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return "";
        }

        return value.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="page-eyebrow">
                        NEXSERVE
                    </span>

                    <h1>My Jobs</h1>

                    <p>
                        Track all your service requests in
                        one place.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                        navigate("/customer/post-job")
                    }
                >
                    + Post New Job
                </button>
            </div>

            {error && (
                <div className="error-box">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={loadJobs}
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="job-filters">
                <button
                    type="button"
                    className={
                        filter === "all"
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() => setFilter("all")}
                >
                    All
                    <span>{jobs.length}</span>
                </button>

                <button
                    type="button"
                    className={
                        filter === "active"
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() => setFilter("active")}
                >
                    Active
                    <span>
                        {
                            jobs.filter((job) =>
                                statusGroups.active.includes(
                                    job.status
                                )
                            ).length
                        }
                    </span>
                </button>

                <button
                    type="button"
                    className={
                        filter === "completed"
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() =>
                        setFilter("completed")
                    }
                >
                    Completed
                    <span>
                        {
                            jobs.filter((job) =>
                                statusGroups.completed.includes(
                                    job.status
                                )
                            ).length
                        }
                    </span>
                </button>

                <button
                    type="button"
                    className={
                        filter === "cancelled"
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() =>
                        setFilter("cancelled")
                    }
                >
                    Cancelled
                    <span>
                        {
                            jobs.filter((job) =>
                                statusGroups.cancelled.includes(
                                    job.status
                                )
                            ).length
                        }
                    </span>
                </button>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">▣</div>

                    <h2>
                        {jobs.length === 0
                            ? "No jobs yet"
                            : "No jobs in this category"}
                    </h2>

                    <p>
                        {jobs.length === 0
                            ? "Post a service request and let NexServe find a worker for you."
                            : "Try another filter to see your jobs."}
                    </p>

                    {jobs.length === 0 && (
                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    "/customer/post-job"
                                )
                            }
                        >
                            Post Your First Job
                        </button>
                    )}
                </div>
            ) : (
                <div className="customer-jobs-list">
                    {filteredJobs.map((job) => {
                        const id = job._id || job.id;

                        return (
                            <div
                                className="customer-job-item"
                                key={id}
                            >
                                <div className="customer-job-info">
                                    <div className="job-title-row">
                                        <h2>
                                            {job.title ||
                                                "Service Job"}
                                        </h2>

                                        <StatusBadge
                                            status={
                                                job.status
                                            }
                                        />
                                    </div>

                                    <p className="job-description">
                                        {job.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="job-meta">
                                        <span>
                                            {
                                                job.category
                                            }
                                        </span>

                                        <span>
                                            {
                                                job.requiredSkill
                                            }
                                        </span>

                                        <span>
                                            {job.area ||
                                                job.city ||
                                                "Location"}
                                        </span>

                                        {job.createdAt && (
                                            <span>
                                                {formatDate(
                                                    job.createdAt
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="customer-job-side">
                                    <div className="job-price-large">
                                        {getPrice(job)}
                                    </div>

                                    <span className="job-status-text">
                                        {getStatusText(
                                            job.status
                                        )}
                                    </span>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            navigate(
                                                `/customer/job/${id}`
                                            )
                                        }
                                    >
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <button
                type="button"
                className="refresh-button"
                onClick={loadJobs}
            >
                ↻ Refresh Jobs
            </button>
        </div>
    );
}

export default MyJobs;