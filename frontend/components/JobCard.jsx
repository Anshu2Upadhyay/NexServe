import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function JobCard({ job, role = "customer" }) {
    const navigate = useNavigate();

    if (!job) return null;

    const jobId = job._id || job.id;

    const formatMoney = (amount) => {
        return `₹${Number(amount || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    const getPrice = () => {
        if (Number(job.finalPrice) > 0) {
            return formatMoney(job.finalPrice);
        }

        if (
            job.estimatedMinPrice ||
            job.estimatedMaxPrice
        ) {
            return `${formatMoney(
                job.estimatedMinPrice
            )} - ${formatMoney(
                job.estimatedMaxPrice
            )}`;
        }

        return "Price pending";
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

    const handleDetails = () => {
        if (!jobId) return;

        if (role === "worker") {
            navigate(`/worker/job/${jobId}`);
        } else {
            navigate(`/customer/job/${jobId}`);
        }
    };

    return (
        <article className="job-card">
            <div className="job-card-main">
                <div className="job-card-top">
                    <div>
                        <span className="job-category">
                            {job.category || "Service"}
                        </span>

                        <h3>
                            {job.title || "Service Job"}
                        </h3>
                    </div>

                    <StatusBadge status={job.status} />
                </div>

                <p className="job-card-description">
                    {job.description ||
                        "No description provided."}
                </p>

                <div className="job-card-meta">
                    {job.requiredSkill && (
                        <span>
                            🔧 {job.requiredSkill}
                        </span>
                    )}

                    {(job.area || job.city) && (
                        <span>
                            📍{" "}
                            {job.area
                                ? `${job.area}, ${job.city || ""}`
                                : job.city}
                        </span>
                    )}

                    {job.createdAt && (
                        <span>
                            📅{" "}
                            {formatDate(
                                job.createdAt
                            )}
                        </span>
                    )}
                </div>
            </div>

            <div className="job-card-side">
                <span className="job-card-price-label">
                    {Number(job.finalPrice) > 0
                        ? "Final Price"
                        : "Estimated Price"}
                </span>

                <strong className="job-card-price">
                    {getPrice()}
                </strong>

                {role === "worker" &&
                    job.distance != null && (
                        <span className="job-distance">
                            {Number(
                                job.distance
                            ).toFixed(1)}{" "}
                            km away
                        </span>
                    )}

                <button
                    type="button"
                    className="secondary-button"
                    onClick={handleDetails}
                >
                    View Details →
                </button>
            </div>
        </article>
    );
}

export default JobCard;