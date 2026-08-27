import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getJobById,
    cancelJob
} from "../services/jobService";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";

function JobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        if (jobId) {
            loadJob();
        }
    }, [jobId]);

    const loadJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getJobById(jobId);

            if (!response?.success) {
                throw new Error(
                    response?.message || "Job not found"
                );
            }

            setJob(
                response.job ||
                    response.data?.job ||
                    response.data
            );
        } catch (err) {
            setError(
                err?.message || "Unable to load job details."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            setError("Please enter a cancellation reason.");
            return;
        }

        try {
            setCancelling(true);
            setError("");

            const response = await cancelJob(
                jobId,
                cancelReason.trim()
            );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Unable to cancel job."
                );
            }

            setShowCancel(false);
            setCancelReason("");

            await loadJob();
        } catch (err) {
            setError(
                err?.message || "Unable to cancel job."
            );
        } finally {
            setCancelling(false);
        }
    };

    const formatMoney = (amount) => {
        return `₹${Number(amount || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return "—";
        }

        return value.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    const getStatusText = (status) => {
        const statusMap = {
            posted: "Finding a worker",
            accepted: "Worker accepted",
            traveling: "Worker is on the way",
            arrived: "Worker arrived",
            in_progress: "Work in progress",
            waiting_payment: "Payment required",
            completed: "Job completed",
            cancelled: "Job cancelled"
        };

        return statusMap[status] || "Processing";
    };

    const canCancel = [
        "posted",
        "accepted",
        "traveling"
    ].includes(job?.status);

    const needsPayment =
        job?.status === "waiting_payment";

    const canRate =
        job?.status === "completed" &&
        job?.rating == null;

    if (loading) {
        return <Loader />;
    }

    if (error && !job) {
        return (
            <div className="dashboard-page">
                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate("/customer/my-jobs")
                    }
                >
                    ← Back to My Jobs
                </button>

                <div className="error-box">
                    {error}

                    <button
                        type="button"
                        onClick={loadJob}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="dashboard-page">
                <div className="empty-state">
                    <h2>Job not found</h2>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate("/customer/my-jobs")
                        }
                    >
                        Back to My Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page job-details-page">
            <button
                type="button"
                className="back-button"
                onClick={() =>
                    navigate("/customer/my-jobs")
                }
            >
                ← Back to My Jobs
            </button>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            <div className="job-details-header">
                <div>
                    <span className="page-eyebrow">
                        JOB DETAILS
                    </span>

                    <h1>
                        {job.title || "Service Job"}
                    </h1>

                    <p>
                        Created{" "}
                        {formatDate(job.createdAt)}
                    </p>
                </div>

                <StatusBadge status={job.status} />
            </div>

            <div className="job-details-layout">
                <main>
                    <section className="details-card">
                        <div className="card-heading">
                            <h2>Service Details</h2>
                        </div>

                        <div className="detail-grid">
                            <div>
                                <span>Category</span>
                                <strong>
                                    {job.category ||
                                        "General"}
                                </strong>
                            </div>

                            <div>
                                <span>Required Skill</span>
                                <strong>
                                    {job.requiredSkill ||
                                        "General"}
                                </strong>
                            </div>

                            <div>
                                <span>Urgency</span>
                                <strong>
                                    {job.urgency ||
                                        "Normal"}
                                </strong>
                            </div>

                            <div>
                                <span>Booking Type</span>
                                <strong>
                                    {job.bookingType ||
                                        "Instant"}
                                </strong>
                            </div>
                        </div>

                        <div className="description-block">
                            <span>Description</span>

                            <p>
                                {job.description ||
                                    "No description provided."}
                            </p>
                        </div>
                    </section>

                    <section className="details-card">
                        <div className="card-heading">
                            <h2>Location</h2>
                        </div>

                        <div className="location-details">
                            <div>
                                <span>City</span>
                                <strong>
                                    {job.city || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Area</span>
                                <strong>
                                    {job.area || "—"}
                                </strong>
                            </div>
                        </div>

                        {job.location?.latitude != null &&
                            job.location?.longitude !=
                                null && (
                                <div className="coordinates">
                                    📍{" "}
                                    {Number(
                                        job.location.latitude
                                    ).toFixed(5)}
                                    ,{" "}
                                    {Number(
                                        job.location.longitude
                                    ).toFixed(5)}
                                </div>
                            )}
                    </section>

                    {job.assignedWorker && (
                        <section className="details-card">
                            <div className="card-heading">
                                <h2>Assigned Worker</h2>
                            </div>

                            <div className="worker-summary">
                                <div className="worker-avatar">
                                    {(
                                        job.assignedWorker
                                            .name || "W"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h3>
                                        {
                                            job.assignedWorker
                                                .name
                                        }
                                    </h3>

                                    <p>
                                        {job.assignedWorker
                                            .phone ||
                                            "Worker"}
                                    </p>

                                    {job.assignedWorker
                                        .skills && (
                                        <small>
                                            {Array.isArray(
                                                job
                                                    .assignedWorker
                                                    .skills
                                            )
                                                ? job
                                                      .assignedWorker
                                                      .skills.join(
                                                          ", "
                                                      )
                                                : job
                                                      .assignedWorker
                                                      .skills}
                                        </small>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="details-card">
                        <div className="card-heading">
                            <h2>Price</h2>
                        </div>

                        <div className="price-summary">
                            <div>
                                <span>
                                    Estimated Range
                                </span>

                                <strong>
                                    {formatMoney(
                                        job.estimatedMinPrice
                                    )}{" "}
                                    –{" "}
                                    {formatMoney(
                                        job.estimatedMaxPrice
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Final Price</span>

                                <strong>
                                    {Number(
                                        job.finalPrice
                                    ) > 0
                                        ? formatMoney(
                                              job.finalPrice
                                          )
                                        : "Not finalized"}
                                </strong>
                            </div>
                        </div>
                    </section>
                </main>

                <aside>
                    <section className="details-card status-card">
                        <span className="page-eyebrow">
                            CURRENT STATUS
                        </span>

                        <h2>
                            {getStatusText(
                                job.status
                            )}
                        </h2>

                        <div className="status-timeline">
                            <div
                                className={
                                    [
                                        "posted",
                                        "accepted",
                                        "traveling",
                                        "arrived",
                                        "in_progress",
                                        "waiting_payment",
                                        "completed"
                                    ].includes(
                                        job.status
                                    )
                                        ? "timeline-item active"
                                        : "timeline-item"
                                }
                            >
                                <span>1</span>
                                <div>
                                    <strong>
                                        Job Posted
                                    </strong>
                                    <small>
                                        Your request has
                                        been submitted.
                                    </small>
                                </div>
                            </div>

                            <div
                                className={
                                    [
                                        "accepted",
                                        "traveling",
                                        "arrived",
                                        "in_progress",
                                        "waiting_payment",
                                        "completed"
                                    ].includes(
                                        job.status
                                    )
                                        ? "timeline-item active"
                                        : "timeline-item"
                                }
                            >
                                <span>2</span>
                                <div>
                                    <strong>
                                        Worker Assigned
                                    </strong>
                                    <small>
                                        A suitable worker
                                        accepts the job.
                                    </small>
                                </div>
                            </div>

                            <div
                                className={
                                    [
                                        "in_progress",
                                        "waiting_payment",
                                        "completed"
                                    ].includes(
                                        job.status
                                    )
                                        ? "timeline-item active"
                                        : "timeline-item"
                                }
                            >
                                <span>3</span>
                                <div>
                                    <strong>
                                        Work
                                    </strong>
                                    <small>
                                        Worker completes
                                        the service.
                                    </small>
                                </div>
                            </div>

                            <div
                                className={
                                    [
                                        "completed"
                                    ].includes(
                                        job.status
                                    )
                                        ? "timeline-item active"
                                        : "timeline-item"
                                }
                            >
                                <span>4</span>
                                <div>
                                    <strong>
                                        Complete
                                    </strong>
                                    <small>
                                        Payment and rating
                                        finish the job.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </section>

                    {needsPayment && (
                        <section className="details-card action-card">
                            <h3>
                                Payment Required
                            </h3>

                            <p>
                                The final price has been
                                set. Complete the payment
                                to finish the job.
                            </p>

                            <button
                                type="button"
                                className="primary-button full-width"
                                onClick={() =>
                                    navigate(
                                        `/customer/payment/${jobId}`
                                    )
                                }
                            >
                                Pay{" "}
                                {formatMoney(
                                    job.finalPrice
                                )}
                            </button>
                        </section>
                    )}

                    {canRate && (
                        <section className="details-card action-card">
                            <h3>
                                Rate your experience
                            </h3>

                            <p>
                                Your feedback helps improve
                                NexServe.
                            </p>

                            <button
                                type="button"
                                className="primary-button full-width"
                                onClick={() =>
                                    navigate(
                                        `/customer/payment/${jobId}`,
                                        {
                                            state: {
                                                showRating: true
                                            }
                                        }
                                    )
                                }
                            >
                                Rate Worker
                            </button>
                        </section>
                    )}

                    {job.status === "completed" &&
                        job.rating != null && (
                            <section className="details-card">
                                <div className="card-heading">
                                    <h2>Your Rating</h2>
                                </div>

                                <div className="rating-display">
                                    <strong>
                                        {"★".repeat(
                                            Number(
                                                job.rating
                                            )
                                        )}
                                    </strong>

                                    <span>
                                        {job.rating}/5
                                    </span>
                                </div>

                                {job.review && (
                                    <p>
                                        "{job.review}"
                                    </p>
                                )}
                            </section>
                        )}

                    {canCancel && (
                        <section className="details-card danger-card">
                            {!showCancel ? (
                                <>
                                    <h3>
                                        Need to cancel?
                                    </h3>

                                    <button
                                        type="button"
                                        className="danger-button"
                                        onClick={() =>
                                            setShowCancel(
                                                true
                                            )
                                        }
                                    >
                                        Cancel Job
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>
                                        Cancel this job
                                    </h3>

                                    <textarea
                                        rows="3"
                                        placeholder="Why are you cancelling?"
                                        value={
                                            cancelReason
                                        }
                                        onChange={(e) =>
                                            setCancelReason(
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                    <div className="action-row">
                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() => {
                                                setShowCancel(
                                                    false
                                                );
                                                setCancelReason(
                                                    ""
                                                );
                                            }}
                                        >
                                            Keep Job
                                        </button>

                                        <button
                                            type="button"
                                            className="danger-button"
                                            disabled={
                                                cancelling
                                            }
                                            onClick={
                                                handleCancel
                                            }
                                        >
                                            {cancelling
                                                ? "Cancelling..."
                                                : "Confirm Cancel"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
}

export default JobDetails;