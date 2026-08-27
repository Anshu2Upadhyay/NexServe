import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function WorkerJobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState("");

    const loadJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/jobs/${id}`);

            setJob(
                response?.job ||
                response?.data?.job ||
                response?.data
            );
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to load job"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadJob();
        }
    }, [id]);

    const acceptJob = async () => {
        try {
            setAccepting(true);
            setError("");

            await api.patch(`/jobs/${id}/accept`, {});

            await loadJob();

            navigate(`/worker/jobs/${id}`);
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to accept job"
            );
        } finally {
            setAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <h2>Job not found</h2>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate("/worker/jobs")
                        }
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const status =
        String(job.status || "").toLowerCase();

    const alreadyAccepted =
        status.includes("accept") ||
        status.includes("travel") ||
        status.includes("arriv") ||
        status.includes("progress") ||
        status.includes("complete");

    return (
        <div className="page-container">

            <button
                className="back-button"
                onClick={() =>
                    navigate("/worker/jobs")
                }
            >
                ← Back to Jobs
            </button>

            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        JOB DETAILS
                    </span>

                    <h1>
                        {job.title ||
                            job.serviceName ||
                            "Service Job"}
                    </h1>

                    <p>
                        Review the request before accepting it.
                    </p>
                </div>

                <span className="status-badge status-posted">
                    {job.status || "Available"}
                </span>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="job-details-layout">

                <div className="job-details-main">

                    <div className="detail-card">

                        <h2>Service Information</h2>

                        <div className="detail-grid">

                            <div className="detail-item">
                                <span>
                                    Category
                                </span>

                                <strong>
                                    {job.category || "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {job.status || "Available"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    City
                                </span>

                                <strong>
                                    {job.city ||
                                        job.location?.city ||
                                        "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Area
                                </span>

                                <strong>
                                    {job.area ||
                                        job.location?.area ||
                                        "—"}
                                </strong>
                            </div>

                        </div>

                        <div className="detail-description">

                            <span>
                                Customer Requirement
                            </span>

                            <p>
                                {job.description ||
                                    "No additional description."}
                            </p>

                        </div>

                    </div>

                    {(job.images?.length ||
                        job.photos?.length ||
                        job.videos?.length) ? (
                        <div className="detail-card">

                            <h2>
                                Customer Media
                            </h2>

                            <div className="media-preview-grid">

                                {(
                                    job.images ||
                                    job.photos ||
                                    []
                                ).map((image, index) => (
                                    <div
                                        className="media-preview"
                                        key={index}
                                    >
                                        <img
                                            src={
                                                typeof image ===
                                                "string"
                                                    ? image
                                                    : image.url
                                            }
                                            alt="Job"
                                        />
                                    </div>
                                ))}

                            </div>

                        </div>
                    ) : null}

                </div>

                <div className="job-details-side">

                    <div className="detail-card">

                        <h2>Price</h2>

                        <div className="price-summary">

                            <div className="price-row">
                                <span>
                                    Customer Budget
                                </span>

                                <strong>
                                    ₹
                                    {job.budget ??
                                        "—"}
                                </strong>
                            </div>

                            <div className="price-row">
                                <span>
                                    AI Estimated Minimum
                                </span>

                                <strong>
                                    ₹
                                    {job.estimatedMinPrice ??
                                        "—"}
                                </strong>
                            </div>

                            <div className="price-row">
                                <span>
                                    AI Estimated Maximum
                                </span>

                                <strong>
                                    ₹
                                    {job.estimatedMaxPrice ??
                                        "—"}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="detail-card">

                        <h2>Job Action</h2>

                        {alreadyAccepted ? (
                            <button
                                className="primary-btn full-width"
                                onClick={() =>
                                    navigate(
                                        `/worker/jobs/${id}/active`
                                    )
                                }
                            >
                                Manage Job
                            </button>
                        ) : (
                            <button
                                className="primary-btn full-width"
                                onClick={acceptJob}
                                disabled={accepting}
                            >
                                {accepting
                                    ? "Accepting..."
                                    : "Accept Job"}
                            </button>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}