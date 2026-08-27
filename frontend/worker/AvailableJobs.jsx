import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AvailableJobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchAvailableJobs = async () => {
        try {
            setError("");

            const response = await api.get("/jobs/available");

            const availableJobs =
                response?.jobs ??
                response?.data?.jobs ??
                response?.data ??
                [];

            setJobs(Array.isArray(availableJobs) ? availableJobs : []);
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to load available jobs."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAvailableJobs();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAvailableJobs();
    };

    const getJobId = (job) => {
        return job?._id || job?.id;
    };

    const getBudget = (job) => {
        if (job?.budget !== undefined && job?.budget !== null) {
            return job.budget;
        }

        if (
            job?.estimatedMinPrice !== undefined &&
            job?.estimatedMinPrice !== null
        ) {
            return job.estimatedMinPrice;
        }

        return null;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <span className="eyebrow">
                            WORKER
                        </span>
                        <h1>Available Jobs</h1>
                        <p>
                            Finding service requests near you...
                        </p>
                    </div>
                </div>

                <div className="loading">
                    <div className="spinner" />
                    <p>Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            {/* HEADER */}
            <div className="page-header">

                <div>
                    <span className="eyebrow">
                        WORKER
                    </span>

                    <h1>Available Jobs</h1>

                    <p>
                        Service requests available in your
                        service area.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>

            </div>

            {/* ERROR */}
            {error && (
                <div className="error-message">
                    <strong>Something went wrong</strong>
                    <span>{error}</span>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={fetchAvailableJobs}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* EMPTY */}
            {!error && jobs.length === 0 && (
                <div className="empty-state">

                    <div className="empty-state-icon">
                        🔎
                    </div>

                    <h2>No Available Jobs</h2>

                    <p>
                        There are currently no service requests
                        matching your location and skills.
                    </p>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={handleRefresh}
                    >
                        Check Again
                    </button>

                </div>
            )}

            {/* JOBS */}
            {jobs.length > 0 && (
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
                                Choose a job that matches your
                                skills.
                            </p>
                        </div>
                    </div>

                    <div className="job-list">

                        {jobs.map((job) => {

                            const jobId = getJobId(job);
                            const budget = getBudget(job);

                            return (
                                <article
                                    className="job-card"
                                    key={jobId}
                                >

                                    {/* TOP */}
                                    <div className="job-card-header">

                                        <div>
                                            <span className="job-category">
                                                {job?.category ||
                                                    "SERVICE"}
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

                                    {/* DESCRIPTION */}
                                    <p className="job-description">
                                        {job?.description ||
                                            "Customer has requested a service."}
                                    </p>

                                    {/* LOCATION */}
                                    <div className="job-meta">

                                        <span>
                                            📍{" "}
                                            {job?.area ||
                                                job?.location?.area ||
                                                "Area not specified"}
                                        </span>

                                        <span>
                                            🏙️{" "}
                                            {job?.city ||
                                                job?.location?.city ||
                                                "City not specified"}
                                        </span>

                                        {job?.distance !==
                                            undefined &&
                                            job?.distance !==
                                                null && (
                                                <span>
                                                    📏{" "}
                                                    {job.distance}{" "}
                                                    km
                                                </span>
                                            )}

                                    </div>

                                    {/* FOOTER */}
                                    <div className="job-card-footer">

                                        <div className="job-price-box">

                                            <span className="job-price-label">
                                                Customer Budget
                                            </span>

                                            <strong className="job-price">
                                                {budget !== null
                                                    ? `₹${budget}`
                                                    : "Price pending"}
                                            </strong>

                                        </div>

                                        <button
                                            type="button"
                                            className="primary-btn"
                                            disabled={!jobId}
                                            onClick={() => {
                                                if (!jobId) return;

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