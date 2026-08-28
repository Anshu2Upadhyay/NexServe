import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function WorkerJobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState("");

    // ======================================================
    // LOAD JOB DETAILS
    // ======================================================

    const loadJob = async () => {
        if (!jobId) {
            setError("Invalid job ID");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/jobs/worker/${jobId}`
            );

            const jobData =
                response?.job ||
                response?.data?.job ||
                response?.data ||
                null;

            if (!jobData) {
                throw new Error(
                    "Job details were not found"
                );
            }

            setJob(jobData);
        } catch (err) {
            console.error(
                "Worker job details error:",
                err
            );

            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to load job details"
            );

            setJob(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJob();
    }, [jobId]);

    // ======================================================
    // ACCEPT JOB
    // ======================================================

    const handleAcceptJob = async () => {
        if (!jobId || accepting) {
            return;
        }

        try {
            setAccepting(true);
            setError("");

            const response = await api.patch(
                `/jobs/${jobId}/accept`,
                {}
            );

            const updatedJob =
                response?.job ||
                response?.data?.job ||
                null;

            if (updatedJob) {
                setJob(updatedJob);
            }

            // After successful acceptance,
            // go directly to active job management.
            navigate(
                `/worker/jobs/${jobId}/active`
            );
        } catch (err) {
            console.error(
                "Accept job error:",
                err
            );

            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to accept this job"
            );
        } finally {
            setAccepting(false);
        }
    };

    // ======================================================
    // STATUS
    // ======================================================

    const status = String(
        job?.status || "posted"
    ).toLowerCase();

    const statusLabel = {
        posted: "Available",
        searching: "Available",
        accepted: "Accepted",
        on_the_way: "On the way",
        traveling: "On the way",
        arrived: "Arrived",
        in_progress: "In progress",
        waiting_payment: "Payment pending",
        completed: "Completed",
        cancelled: "Cancelled"
    };

    const currentStatus =
        statusLabel[status] ||
        job?.status ||
        "Available";

    const canAccept =
        status === "posted" ||
        status === "searching";

    const canManage =
        status === "accepted" ||
        status === "on_the_way" ||
        status === "traveling" ||
        status === "arrived" ||
        status === "in_progress" ||
        status === "waiting_payment";

    // ======================================================
    // PRICE
    // ======================================================

    const customerBudget =
        job?.budget !== undefined &&
        job?.budget !== null
            ? job.budget
            : null;

    const estimatedMin =
        job?.estimatedMinPrice !== undefined &&
        job?.estimatedMinPrice !== null
            ? job.estimatedMinPrice
            : null;

    const estimatedMax =
        job?.estimatedMaxPrice !== undefined &&
        job?.estimatedMaxPrice !== null
            ? job.estimatedMaxPrice
            : null;

    const finalPrice =
        job?.finalPrice !== undefined &&
        job?.finalPrice !== null &&
        Number(job.finalPrice) > 0
            ? job.finalPrice
            : null;

    const formatPrice = (price) => {
        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {
            return "—";
        }

        const number =
            Number(price);

        if (Number.isNaN(number)) {
            return "—";
        }

        return `₹${number.toLocaleString(
            "en-IN"
        )}`;
    };

    // ======================================================
    // LOCATION
    // ======================================================

    const city =
        job?.city ||
        job?.location?.city ||
        "—";

    const area =
        job?.area ||
        job?.location?.area ||
        "—";

    const distance =
        job?.distance !== undefined &&
        job?.distance !== null
            ? job.distance
            : null;

    // ======================================================
    // MEDIA
    // ======================================================

    const mediaItems = useMemo(() => {
        const items = [];

        if (job?.image) {
            items.push({
                url:
                    typeof job.image === "string"
                        ? job.image
                        : job.image?.url,
                type: "image"
            });
        }

        const images =
            Array.isArray(job?.images)
                ? job.images
                : [];

        const photos =
            Array.isArray(job?.photos)
                ? job.photos
                : [];

        [...images, ...photos].forEach(
            (item) => {
                const url =
                    typeof item === "string"
                        ? item
                        : item?.url;

                if (url) {
                    items.push({
                        url,
                        type: "image"
                    });
                }
            }
        );

        // Remove duplicate URLs
        return items.filter(
            (item, index, array) =>
                array.findIndex(
                    (media) =>
                        media.url === item.url
                ) === index
        );
    }, [job]);

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="page-container">

                <div className="loading">
                    <div className="spinner" />

                    <p>
                        Loading job details...
                    </p>
                </div>

            </div>
        );
    }

    // ======================================================
    // JOB NOT FOUND
    // ======================================================

    if (!job) {
        return (
            <div className="page-container">

                <div className="empty-state">

                    <div className="empty-state-icon">
                        🔎
                    </div>

                    <h2>
                        Job not found
                    </h2>

                    <p>
                        This job may no longer be
                        available or could not be loaded.
                    </p>

                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                "/worker/jobs"
                            )
                        }
                    >
                        Back to Jobs
                    </button>

                </div>

            </div>
        );
    }

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="page-container">

            {/* ==================================================
                BACK BUTTON
            ================================================== */}

            <button
                type="button"
                className="back-button"
                onClick={() =>
                    navigate(
                        "/worker/jobs"
                    )
                }
            >
                ← Back to Jobs
            </button>


            {/* ==================================================
                HEADER
            ================================================== */}

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
                        Review the customer request
                        before accepting the job.
                    </p>

                </div>

                <span
                    className={`status-badge ${
                        status === "cancelled"
                            ? "status-cancelled"
                            : status === "completed"
                            ? "status-completed"
                            : canAccept
                            ? "status-posted"
                            : "status-active"
                    }`}
                >
                    <span className="status-dot" />

                    {currentStatus}
                </span>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="error-message">

                    <strong>
                        Something went wrong
                    </strong>

                    <span>
                        {error}
                    </span>

                </div>
            )}


            {/* ==================================================
                MAIN LAYOUT
            ================================================== */}

            <div className="job-details-layout">


                {/* ==================================================
                    LEFT
                ================================================== */}

                <div className="job-details-main">


                    {/* ==================================================
                        SERVICE INFORMATION
                    ================================================== */}

                    <div className="detail-card">

                        <h2>
                            Service Information
                        </h2>

                        <div className="detail-grid">

                            <div className="detail-item">

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {job.category ||
                                        "—"}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Required Skill
                                </span>

                                <strong>
                                    {job.requiredSkill ||
                                        "—"}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {currentStatus}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    City
                                </span>

                                <strong>
                                    {city}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Area
                                </span>

                                <strong>
                                    {area}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Distance
                                </span>

                                <strong>
                                    {distance !== null
                                        ? `${distance} km`
                                        : "—"}
                                </strong>

                            </div>

                        </div>


                        {/* CUSTOMER REQUIREMENT */}

                        <div className="detail-description">

                            <span>
                                Customer Requirement
                            </span>

                            <p>
                                {job.description ||
                                    "No additional description provided."}
                            </p>

                        </div>

                    </div>


                    {/* ==================================================
                        CUSTOMER MEDIA
                    ================================================== */}

                    {mediaItems.length > 0 && (
                        <div className="detail-card">

                            <h2>
                                Customer Media
                            </h2>

                            <div className="media-preview-grid">

                                {mediaItems.map(
                                    (media, index) => (
                                        <div
                                            className="media-preview"
                                            key={`${media.url}-${index}`}
                                        >

                                            <img
                                                src={media.url}
                                                alt={`Customer job ${
                                                    index + 1
                                                }`}
                                                loading="lazy"
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />

                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        CUSTOMER INFORMATION
                    ================================================== */}

                    {job.customer && (
                        <div className="detail-card">

                            <h2>
                                Customer Information
                            </h2>

                            <div className="detail-grid">

                                <div className="detail-item">

                                    <span>
                                        Name
                                    </span>

                                    <strong>
                                        {job.customer.name ||
                                            "—"}
                                    </strong>

                                </div>

                                {job.customer.phone && (
                                    <div className="detail-item">

                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            {job.customer.phone}
                                        </strong>

                                    </div>
                                )}

                            </div>

                        </div>
                    )}

                </div>


                {/* ==================================================
                    RIGHT
                ================================================== */}

                <div className="job-details-side">


                    {/* ==================================================
                        PRICE
                    ================================================== */}

                    <div className="detail-card">

                        <h2>
                            Price
                        </h2>

                        <div className="price-summary">

                            <div className="price-row">

                                <span>
                                    Customer Budget
                                </span>

                                <strong>
                                    {formatPrice(
                                        customerBudget
                                    )}
                                </strong>

                            </div>


                            <div className="price-row">

                                <span>
                                    AI Estimated Minimum
                                </span>

                                <strong>
                                    {formatPrice(
                                        estimatedMin
                                    )}
                                </strong>

                            </div>


                            <div className="price-row">

                                <span>
                                    AI Estimated Maximum
                                </span>

                                <strong>
                                    {formatPrice(
                                        estimatedMax
                                    )}
                                </strong>

                            </div>


                            {finalPrice !== null && (
                                <div className="price-row">

                                    <span>
                                        Final Price
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            finalPrice
                                        )}
                                    </strong>

                                </div>
                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        JOB ACTION
                    ================================================== */}

                    <div className="detail-card">

                        <h2>
                            Job Action
                        </h2>


                        {/* AVAILABLE */}

                        {canAccept && (
                            <>
                                <p>
                                    This job is currently
                                    available for you to
                                    accept.
                                </p>

                                <button
                                    type="button"
                                    className="primary-btn full-width"
                                    onClick={
                                        handleAcceptJob
                                    }
                                    disabled={
                                        accepting
                                    }
                                >
                                    {accepting
                                        ? "Accepting..."
                                        : "Accept Job"}
                                </button>
                            </>
                        )}


                        {/* ACTIVE */}

                        {canManage && (
                            <>
                                <p>
                                    You have accepted this
                                    job. Continue managing
                                    the service.
                                </p>

                                <button
                                    type="button"
                                    className="primary-btn full-width"
                                    onClick={() =>
                                        navigate(
                                            `/worker/jobs/${jobId}/active`
                                        )
                                    }
                                >
                                    Manage Job
                                </button>
                            </>
                        )}


                        {/* COMPLETED */}

                        {status ===
                            "completed" && (
                            <>
                                <p>
                                    This job has already
                                    been completed.
                                </p>

                                <button
                                    type="button"
                                    className="secondary-btn full-width"
                                    onClick={() =>
                                        navigate(
                                            "/worker/jobs"
                                        )
                                    }
                                >
                                    Back to Jobs
                                </button>
                            </>
                        )}


                        {/* CANCELLED */}

                        {status ===
                            "cancelled" && (
                            <>
                                <p>
                                    This job has been
                                    cancelled and is no
                                    longer available.
                                </p>

                                <button
                                    type="button"
                                    className="secondary-btn full-width"
                                    onClick={() =>
                                        navigate(
                                            "/worker/jobs"
                                        )
                                    }
                                >
                                    Back to Jobs
                                </button>
                            </>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}