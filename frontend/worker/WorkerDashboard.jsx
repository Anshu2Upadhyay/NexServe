import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getCurrentUser } from "../services/authService";

export default function WorkerDashboard() {
    const navigate = useNavigate();
    const worker = getCurrentUser();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/jobs/available");

            setJobs(
                response?.jobs ||
                response?.data?.jobs ||
                response?.data ||
                []
            );
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                "Unable to load jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <span className="eyebrow">WORKER DASHBOARD</span>
                    <h1>
                        Welcome, {worker?.name || "Worker"}
                    </h1>
                    <p>
                        Manage nearby service requests and your work.
                    </p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={loadJobs}
                >
                    Refresh
                </button>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <div className="stat-card-label">
                        Available Jobs
                    </div>
                    <div className="stat-card-value">
                        {jobs.length}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">
                        Skills
                    </div>
                    <div className="stat-card-value">
                        {worker?.skills?.length || 0}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">
                        Experience
                    </div>
                    <div className="stat-card-value">
                        {worker?.experience || 0}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">
                        Location
                    </div>
                    <div
                        className="stat-card-value"
                        style={{ fontSize: "18px" }}
                    >
                        {worker?.city || "Not set"}
                    </div>
                </div>

            </div>

            <div className="section">

                <div className="section-header">
                    <div>
                        <h2>Available Jobs</h2>
                        <p>
                            Jobs available according to your area
                            and skills.
                        </p>
                    </div>
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
                ) : jobs.length === 0 ? (
                    <div className="empty-state">
                        <h2>No jobs available</h2>
                        <p>
                            New matching jobs will appear here.
                        </p>

                        <button
                            className="primary-btn"
                            onClick={loadJobs}
                        >
                            Check Again
                        </button>
                    </div>
                ) : (
                    <div className="job-list">

                        {jobs.map((job) => {

                            const id =
                                job._id ||
                                job.id;

                            return (
                                <div
                                    className="job-card"
                                    key={id}
                                >

                                    <div className="job-card-header">

                                        <div>
                                            <div className="job-category">
                                                {job.category ||
                                                    "SERVICE"}
                                            </div>

                                            <h3>
                                                {job.title ||
                                                    job.serviceName ||
                                                    "Service Request"}
                                            </h3>
                                        </div>

                                        <span className="status-badge status-posted">
                                            <span className="status-dot" />
                                            {job.status ||
                                                "Available"}
                                        </span>

                                    </div>

                                    <p className="job-description">
                                        {job.description ||
                                            "Customer requested a service."}
                                    </p>

                                    <div className="job-meta">
                                        <span>
                                            📍{" "}
                                            {job.area ||
                                                job.location?.area ||
                                                "Nearby"}
                                        </span>

                                        <span>
                                            🏙️{" "}
                                            {job.city ||
                                                job.location?.city ||
                                                worker?.city ||
                                                "—"}
                                        </span>

                                        {job.distance != null && (
                                            <span>
                                                📏 {job.distance} km
                                            </span>
                                        )}
                                    </div>

                                    <div className="job-card-footer">

                                        <div>
                                            <span className="job-price-label">
                                                Customer Budget
                                            </span>

                                            <span className="job-price">
                                                ₹
                                                {job.budget ??
                                                    job.estimatedMinPrice ??
                                                    "—"}
                                            </span>
                                        </div>

                                        <button
                                            className="primary-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/worker/jobs/${id}`
                                                )
                                            }
                                        >
                                            View Job
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
}