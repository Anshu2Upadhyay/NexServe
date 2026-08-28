import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AvailableJobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ======================================================
    // FETCH AVAILABLE JOBS
    // ======================================================

    const fetchAvailableJobs = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await api.get("/jobs/available");

                const availableJobs =
                    response?.jobs ||
                    response?.data?.jobs ||
                    [];

                setJobs(
                    Array.isArray(availableJobs)
                        ? availableJobs
                        : []
                );
            } catch (err) {
                console.error(
                    "Available jobs error:",
                    err
                );

                setJobs([]);

                setError(
                    err?.data?.message ||
                        err?.message ||
                        "Unable to load available jobs."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        fetchAvailableJobs();
    }, [fetchAvailableJobs]);

    // ======================================================
    // REFRESH
    // ======================================================

    const handleRefresh = () => {
        if (refreshing) return;

        fetchAvailableJobs(true);
    };

    // ======================================================
    // JOB ID
    // ======================================================

    const getJobId = (job) => {
        return job?._id || job?.id || null;
    };

    // ======================================================
    // BUDGET
    // ======================================================

    const getBudget = (job) => {
        if (
            job?.estimatedMinPrice !== undefined &&
            job?.estimatedMinPrice !== null
        ) {
            return job.estimatedMinPrice;
        }

        if (
            job?.budget !== undefined &&
            job?.budget !== null
        ) {
            return job.budget;
        }

        return null;
    };

    // ======================================================
    // PRICE FORMAT
    // ======================================================

    const formatPrice = (price) => {
        const amount = Number(price);

        if (!Number.isFinite(amount)) {
            return "Price pending";
        }

        return `₹${amount.toLocaleString("en-IN")}`;
    };

    // ======================================================
    // CATEGORY
    // ======================================================

    const getCategory = (job) => {
        return (
            job?.category ||
            job?.requiredSkill ||
            "SERVICE"
        );
    };

    // ======================================================
    // LOCATION
    // ======================================================

    const getLocation = (job) => {
        const area =
            job?.area ||
            job?.location?.area ||
            "";

        const city =
            job?.city ||
            job?.location?.city ||
            "";

        if (area && city) {
            return `${area}, ${city}`;
        }

        return (
            area ||
            city ||
            "Location not specified"
        );
    };

    // ======================================================
    // LOADING STATE
    // ======================================================

    if (loading) {
        return (
            <div className="page-container">

                <div className="page-header">

                    <div>
                        <span className="eyebrow">
                            WORKER
                        </span>

                        <h1>
                            Available Jobs
                        </h1>

                        <p>
                            Finding service requests
                            near you...
                        </p>
                    </div>

                </div>

                <div className="loading">

                    <div className="spinner" />

                    <p>
                        Loading jobs...
                    </p>

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
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <span className="eyebrow">
                        WORKER
                    </span>

                    <h1>
                        Available Jobs
                    </h1>

                    <p>
                        Service requests available
                        in your service area.
                    </p>

                </div>

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

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

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                            fetchAvailableJobs()
                        }
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!error &&
                jobs.length === 0 && (
                    <div className="empty-state">

                        <div className="empty-state-icon">
                            🔎
                        </div>

                        <h2>
                            No Available Jobs
                        </h2>

                        <p>
                            There are currently no
                            service requests matching
                            your location and skills.
                        </p>

                        <button
                            type="button"
                            className="primary-btn"
                            onClick={
                                handleRefresh
                            }
                            disabled={
                                refreshing
                            }
                        >
                            {refreshing
                                ? "Checking..."
                                : "Check Again"}
                        </button>

                    </div>
                )}


            {/* ==================================================
                JOB LIST
            ================================================== */}

            {!error &&
                jobs.length > 0 && (
                    <div className="available-jobs-wrapper">

                        <div className="section-header">

                            <div>

                                <h2>
                                    {jobs.length}{" "}
                                    {jobs.length === 1
                                        ? "Job"
                                        : "Jobs"}{" "}
                                    Available
                                </h2>

                                <p>
                                    Choose a job that
                                    matches your skills.
                                </p>

                            </div>

                        </div>


                        <div className="job-list">

                            {jobs.map((job) => {

                                const jobId =
                                    getJobId(job);

                                const budget =
                                    getBudget(job);

                                const category =
                                    getCategory(job);

                                const location =
                                    getLocation(job);

                                return (
                                    <article
                                        className="job-card"
                                        key={
                                            jobId ||
                                            `${job?.title}-${job?.createdAt}`
                                        }
                                    >

                                        {/* ======================
                                            CARD HEADER
                                        ====================== */}

                                        <div className="job-card-header">

                                            <div>

                                                <span className="job-category">
                                                    {category}
                                                </span>

                                                <h3>
                                                    {job?.title ||
                                                        job?.serviceName ||
                                                        "Service Request"}
                                                </h3>

                                            </div>

                                            <span className="status-badge status-posted">

                                                <span className="status-dot" />

                                                Available

                                            </span>

                                        </div>


                                        {/* ======================
                                            DESCRIPTION
                                        ====================== */}

                                        <p className="job-description">

                                            {job?.description ||
                                                "Customer has requested a service."}

                                        </p>


                                        {/* ======================
                                            JOB META
                                        ====================== */}

                                        <div className="job-meta">

                                            <span>
                                                📍{" "}
                                                {location}
                                            </span>

                                            {job?.urgency && (
                                                <span>
                                                    ⚡{" "}
                                                    {String(
                                                        job.urgency
                                                    )
                                                        .replace(
                                                            /_/g,
                                                            " "
                                                        )}
                                                </span>
                                            )}

                                            {job?.distance !==
                                                undefined &&
                                                job?.distance !==
                                                    null && (
                                                    <span>
                                                        📏{" "}
                                                        {
                                                            job.distance
                                                        }{" "}
                                                        km
                                                    </span>
                                                )}

                                        </div>


                                        {/* ======================
                                            FOOTER
                                        ====================== */}

                                        <div className="job-card-footer">

                                            <div className="job-price-box">

                                                <span className="job-price-label">
                                                    Customer Budget
                                                </span>

                                                <strong className="job-price">
                                                    {formatPrice(
                                                        budget
                                                    )}
                                                </strong>

                                                {job?.estimatedMinPrice !==
                                                    undefined &&
                                                    job?.estimatedMaxPrice !==
                                                        undefined &&
                                                    Number(
                                                        job.estimatedMinPrice
                                                    ) !==
                                                        Number(
                                                            job.estimatedMaxPrice
                                                        ) && (
                                                        <small>
                                                            Estimated range:{" "}
                                                            {formatPrice(
                                                                job.estimatedMinPrice
                                                            )}{" "}
                                                            –{" "}
                                                            {formatPrice(
                                                                job.estimatedMaxPrice
                                                            )}
                                                        </small>
                                                    )}

                                            </div>


                                            <button
                                                type="button"
                                                className="primary-btn"
                                                disabled={
                                                    !jobId
                                                }
                                                onClick={() => {

                                                    if (
                                                        !jobId
                                                    ) {
                                                        return;
                                                    }

                                                    navigate(
                                                        `/worker/jobs/${jobId}`
                                                    );

                                                }}
                                            >
                                                View Job
                                            </button>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>

                    </div>
                )}

        </div>
    );
}