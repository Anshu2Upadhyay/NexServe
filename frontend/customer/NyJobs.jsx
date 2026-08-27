import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCustomerJobs } from "../services/jobService";

function NyJobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    const loadJobs = useCallback(async (silent = false) => {
        try {
            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getCustomerJobs();

            const data =
                response?.jobs ||
                response?.data?.jobs ||
                response?.data ||
                [];

            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.message ||
                    err?.data?.message ||
                    "Unable to load your jobs."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const statusGroups = {
        active: [
            "posted",
            "accepted",
            "traveling",
            "arrived",
            "in_progress",
            "waiting_payment",
        ],
        completed: ["completed"],
        cancelled: ["cancelled"],
    };

    const counts = useMemo(() => {
        return {
            all: jobs.length,

            active: jobs.filter((job) =>
                statusGroups.active.includes(job?.status)
            ).length,

            completed: jobs.filter((job) =>
                statusGroups.completed.includes(job?.status)
            ).length,

            cancelled: jobs.filter((job) =>
                statusGroups.cancelled.includes(job?.status)
            ).length,
        };
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        if (filter === "all") return jobs;

        return jobs.filter((job) =>
            statusGroups[filter]?.includes(job?.status)
        );
    }, [jobs, filter]);

    const formatMoney = (amount) => {
        const value = Number(amount);

        if (!Number.isFinite(value) || value <= 0) {
            return null;
        }

        return `₹${value.toLocaleString("en-IN")}`;
    };

    const getPrice = (job) => {
        if (Number(job?.finalPrice) > 0) {
            return formatMoney(job.finalPrice);
        }

        const min = formatMoney(job?.estimatedMinPrice);
        const max = formatMoney(job?.estimatedMaxPrice);

        if (min && max) {
            return `${min} – ${max}`;
        }

        if (min) return min;
        if (max) return max;

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
            cancelled: "Cancelled",
        };

        return labels[status] || "Processing";
    };

    const getStatusClass = (status) => {
        if (status === "completed") return "completed";
        if (status === "cancelled") return "cancelled";
        if (status === "accepted") return "accepted";
        return "active";
    };

    const formatDate = (date) => {
        if (!date) return "Recently";

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return "Recently";
        }

        return value.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getJobTitle = (job) => {
        return (
            job?.title ||
            job?.serviceName ||
            job?.service ||
            "Service Request"
        );
    };

    const getDescription = (job) => {
        return (
            job?.description ||
            job?.problemDescription ||
            job?.problem ||
            "Service request created."
        );
    };

    const getCategory = (job) => {
        return job?.category || "General Service";
    };

    const getSkill = (job) => {
        return job?.requiredSkill || job?.skill || "General";
    };

    const getLocation = (job) => {
        if (job?.area && job?.city) {
            return `${job.area}, ${job.city}`;
        }

        return job?.city || job?.location || "Location not available";
    };

    const getJobId = (job) => {
        return job?._id || job?.id;
    };

    const handleViewDetails = (job) => {
        const id = getJobId(job);

        if (!id) return;

        navigate(`/customer/job/${id}`);
    };

    if (loading) {
        return (
            <div className="myjobs-loading">
                <div className="loading-spinner"></div>
                <p>Loading your service requests...</p>
            </div>
        );
    }

    return (
        <div className="myjobs-page">
            <div className="myjobs-container">

                {/* HEADER */}
                <header className="myjobs-header">

                    <div>
                        <div className="myjobs-brand">
                            NEXSERVE
                        </div>

                        <h1>My Jobs</h1>

                        <p>
                            Track and manage all your service requests
                            in one place.
                        </p>
                    </div>

                    <div className="myjobs-header-actions">

                        {/* HOME */}
                        <button
                            type="button"
                            className="myjobs-home-btn"
                            onClick={() =>
                                navigate("/customer/dashboard")
                            }
                        >
                            <span className="home-arrow">←</span>
                            Home
                        </button>

                        {/* POST NEW JOB */}
                        <button
                            type="button"
                            className="myjobs-primary-btn"
                            onClick={() =>
                                navigate("/customer/post-job")
                            }
                        >
                            <span>+</span>
                            Post New Job
                        </button>

                    </div>

                </header>

                {/* QUICK STATS */}
                <section className="myjobs-stats">

                    <div className="myjobs-stat-card">
                        <div className="stat-icon">⌁</div>

                        <div>
                            <strong>{counts.all}</strong>
                            <span>Total Jobs</span>
                        </div>
                    </div>

                    <div className="myjobs-stat-card">
                        <div className="stat-icon active-icon">
                            ●
                        </div>

                        <div>
                            <strong>{counts.active}</strong>
                            <span>Active</span>
                        </div>
                    </div>

                    <div className="myjobs-stat-card">
                        <div className="stat-icon completed-icon">
                            ✓
                        </div>

                        <div>
                            <strong>{counts.completed}</strong>
                            <span>Completed</span>
                        </div>
                    </div>

                    <div className="myjobs-stat-card">
                        <div className="stat-icon cancelled-icon">
                            ×
                        </div>

                        <div>
                            <strong>{counts.cancelled}</strong>
                            <span>Cancelled</span>
                        </div>
                    </div>

                </section>

                {/* FILTER BAR */}
                <section className="myjobs-toolbar">

                    <div className="myjobs-tabs">

                        {[
                            ["all", "All"],
                            ["active", "Active"],
                            ["completed", "Completed"],
                            ["cancelled", "Cancelled"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                className={
                                    filter === value
                                        ? "myjobs-tab active"
                                        : "myjobs-tab"
                                }
                                onClick={() =>
                                    setFilter(value)
                                }
                            >
                                {label}

                                <span>
                                    {counts[value]}
                                </span>
                            </button>
                        ))}

                    </div>

                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={() => loadJobs(true)}
                        disabled={refreshing}
                    >
                        ↻{" "}
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </section>

                {/* ERROR */}
                {error && (
                    <div className="myjobs-error">

                        <div>
                            <strong>
                                Unable to load jobs
                            </strong>

                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => loadJobs()}
                        >
                            Retry
                        </button>

                    </div>
                )}

                {/* JOB LIST */}
                {filteredJobs.length > 0 ? (

                    <section className="myjobs-list">

                        {filteredJobs.map((job) => {

                            const statusClass =
                                getStatusClass(
                                    job?.status
                                );

                            return (
                                <article
                                    className="myjob-card"
                                    key={getJobId(job)}
                                >

                                    <div className="myjob-main">

                                        <div className="myjob-top">

                                            <div>
                                                <span className="myjob-label">
                                                    SERVICE REQUEST
                                                </span>

                                                <h2>
                                                    {getJobTitle(
                                                        job
                                                    )}
                                                </h2>
                                            </div>

                                            <span
                                                className={`myjob-status ${statusClass}`}
                                            >
                                                <i></i>

                                                {getStatusText(
                                                    job?.status
                                                )}
                                            </span>

                                        </div>

                                        <p className="myjob-description">
                                            {getDescription(
                                                job
                                            )}
                                        </p>

                                        <div className="myjob-meta">

                                            <span>
                                                <b>
                                                    Category
                                                </b>
                                                {getCategory(
                                                    job
                                                )}
                                            </span>

                                            <span>
                                                <b>
                                                    Skill
                                                </b>
                                                {getSkill(
                                                    job
                                                )}
                                            </span>

                                            <span>
                                                <b>
                                                    Location
                                                </b>
                                                {getLocation(
                                                    job
                                                )}
                                            </span>

                                            <span>
                                                <b>
                                                    Requested
                                                </b>

                                                {formatDate(
                                                    job?.createdAt
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="myjob-side">

                                        <div className="myjob-price-label">
                                            ESTIMATED PRICE
                                        </div>

                                        <div className="myjob-price">
                                            {getPrice(job)}
                                        </div>

                                        <div className="myjob-side-status">
                                            {getStatusText(
                                                job?.status
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="myjob-details-btn"
                                            onClick={() =>
                                                handleViewDetails(
                                                    job
                                                )
                                            }
                                        >
                                            View Details
                                            <span>→</span>
                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </section>

                ) : (

                    <section className="myjobs-empty">

                        <div className="empty-icon">
                            +
                        </div>

                        <h2>
                            {filter === "all"
                                ? "No service requests yet"
                                : `No ${filter} jobs`}
                        </h2>

                        <p>
                            {filter === "all"
                                ? "Need something fixed? Post your first service request and let NexServe find the right worker for you."
                                : "There are no jobs in this category right now."}
                        </p>

                        {filter === "all" && (
                            <button
                                type="button"
                                className="myjobs-primary-btn"
                                onClick={() =>
                                    navigate(
                                        "/customer/post-job"
                                    )
                                }
                            >
                                + Post Your First Job
                            </button>
                        )}

                    </section>
                )}

                {/* BOTTOM ACTION */}
                {filteredJobs.length > 0 && (
                    <div className="myjobs-bottom-action">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/customer/post-job"
                                )
                            }
                        >
                            + Need another service?
                        </button>

                    </div>
                )}

            </div>

            <style>{`

                .myjobs-page {
                    min-height: 100vh;
                    background: #f6f8fc;
                    color: #12213f;
                    padding: 42px 24px 70px;
                }

                .myjobs-container {
                    max-width: 1280px;
                    margin: 0 auto;
                }

                /* HEADER */

                .myjobs-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 30px;
                    margin-bottom: 32px;
                }

                .myjobs-brand {
                    color: #54709b;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                }

                .myjobs-header h1 {
                    margin: 0;
                    font-size: clamp(34px, 4vw, 48px);
                    line-height: 1;
                    letter-spacing: -1.8px;
                    color: #0d1d3b;
                }

                .myjobs-header p {
                    margin: 12px 0 0;
                    color: #6b7d9c;
                    font-size: 16px;
                }

                /* HEADER BUTTONS */

                .myjobs-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .myjobs-home-btn {
                    border: 1px solid #dbe3ef;
                    background: #ffffff;
                    color: #344a6b;
                    border-radius: 14px;
                    padding: 15px 20px;
                    font-size: 15px;
                    font-weight: 800;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all .2s ease;
                }

                .myjobs-home-btn:hover {
                    background: #f1f5fa;
                    border-color: #cbd6e5;
                    transform: translateY(-2px);
                }

                .home-arrow {
                    font-size: 18px;
                    margin-right: 6px;
                }

                .myjobs-primary-btn {
                    border: 0;
                    background: #2454df;
                    color: #fff;
                    border-radius: 14px;
                    padding: 16px 22px;
                    font-size: 15px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(36, 84, 223, .2);
                    transition: .2s ease;
                    white-space: nowrap;
                }

                .myjobs-primary-btn:hover {
                    transform: translateY(-2px);
                    background: #1947ca;
                }

                .myjobs-primary-btn span {
                    font-size: 21px;
                    margin-right: 7px;
                    vertical-align: -1px;
                }

                /* STATS */

                .myjobs-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                    margin-bottom: 28px;
                }

                .myjobs-stat-card {
                    background: #fff;
                    border: 1px solid #e2e8f2;
                    border-radius: 17px;
                    padding: 19px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    box-shadow: 0 5px 18px rgba(31, 55, 90, .035);
                }

                .stat-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 13px;
                    background: #edf3ff;
                    color: #2454df;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 900;
                }

                .active-icon {
                    background: #eaf3ff;
                    color: #2563eb;
                    font-size: 12px;
                }

                .completed-icon {
                    background: #eafaf2;
                    color: #14945b;
                }

                .cancelled-icon {
                    background: #fff0f0;
                    color: #df4040;
                }

                .myjobs-stat-card strong {
                    display: block;
                    color: #102144;
                    font-size: 22px;
                }

                .myjobs-stat-card span {
                    display: block;
                    color: #7b8ba5;
                    font-size: 12px;
                    margin-top: 2px;
                }

                /* FILTER */

                .myjobs-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 18px;
                }

                .myjobs-tabs {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .myjobs-tab {
                    border: 1px solid #dde4ef;
                    background: #fff;
                    color: #61718d;
                    border-radius: 11px;
                    padding: 10px 14px;
                    font-size: 14px;
                    font-weight: 750;
                    cursor: pointer;
                }

                .myjobs-tab span {
                    margin-left: 7px;
                    background: #edf1f7;
                    border-radius: 50px;
                    padding: 3px 7px;
                    font-size: 11px;
                }

                .myjobs-tab.active {
                    background: #2454df;
                    border-color: #2454df;
                    color: #fff;
                }

                .myjobs-tab.active span {
                    background: rgba(255,255,255,.18);
                    color: #fff;
                }

                .refresh-btn {
                    border: 0;
                    background: transparent;
                    color: #486489;
                    font-size: 14px;
                    font-weight: 750;
                    cursor: pointer;
                }

                .refresh-btn:disabled {
                    opacity: .5;
                    cursor: wait;
                }

                /* ERROR */

                .myjobs-error {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    background: #fff4f4;
                    border: 1px solid #ffd7d7;
                    border-radius: 14px;
                    padding: 15px 18px;
                    margin-bottom: 18px;
                    color: #8d3030;
                }

                .myjobs-error strong {
                    font-size: 14px;
                }

                .myjobs-error p {
                    margin: 4px 0 0;
                    font-size: 13px;
                }

                .myjobs-error button {
                    border: 0;
                    background: #df4040;
                    color: #fff;
                    border-radius: 9px;
                    padding: 9px 14px;
                    font-weight: 700;
                    cursor: pointer;
                }

                /* JOB CARD */

                .myjobs-list {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .myjob-card {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 270px;
                    background: #fff;
                    border: 1px solid #e0e7f0;
                    border-radius: 19px;
                    overflow: hidden;
                    box-shadow: 0 7px 24px rgba(31, 55, 90, .045);
                    transition: .2s ease;
                }

                .myjob-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px rgba(31, 55, 90, .08);
                }

                .myjob-main {
                    padding: 25px 27px;
                    min-width: 0;
                }

                .myjob-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 18px;
                }

                .myjob-label {
                    display: block;
                    color: #7c8da7;
                    font-size: 10px;
                    font-weight: 850;
                    letter-spacing: 1.3px;
                    margin-bottom: 7px;
                }

                .myjob-top h2 {
                    margin: 0;
                    color: #102247;
                    font-size: 21px;
                    letter-spacing: -.4px;
                }

                .myjob-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    border-radius: 50px;
                    padding: 8px 12px;
                    font-size: 12px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                .myjob-status i {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: currentColor;
                }

                .myjob-status.active {
                    color: #2454df;
                    background: #edf3ff;
                }

                .myjob-status.accepted {
                    color: #7950d9;
                    background: #f3edff;
                }

                .myjob-status.completed {
                    color: #138958;
                    background: #eafaf2;
                }

                .myjob-status.cancelled {
                    color: #d73f3f;
                    background: #fff0f0;
                }

                .myjob-description {
                    margin: 12px 0 20px;
                    color: #687b99;
                    line-height: 1.55;
                    font-size: 14px;
                    max-width: 800px;
                }

                .myjob-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 9px 25px;
                }

                .myjob-meta span {
                    color: #607492;
                    font-size: 12px;
                }

                .myjob-meta b {
                    display: block;
                    color: #8b9ab0;
                    font-size: 10px;
                    font-weight: 750;
                    text-transform: uppercase;
                    letter-spacing: .7px;
                    margin-bottom: 3px;
                }

                .myjob-side {
                    border-left: 1px solid #e8edf4;
                    padding: 24px 22px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-end;
                    text-align: right;
                    background: #fbfcff;
                }

                .myjob-price-label {
                    color: #8a99ad;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .myjob-price {
                    color: #102247;
                    font-size: 23px;
                    font-weight: 850;
                    margin-top: 4px;
                }

                .myjob-side-status {
                    color: #7789a5;
                    font-size: 12px;
                    margin: 5px 0 15px;
                }

                .myjob-details-btn {
                    width: 100%;
                    border: 0;
                    background: #edf2f8;
                    color: #182b4e;
                    border-radius: 11px;
                    padding: 12px 14px;
                    font-weight: 800;
                    font-size: 13px;
                    cursor: pointer;
                    transition: .2s ease;
                }

                .myjob-details-btn:hover {
                    background: #2454df;
                    color: #fff;
                }

                .myjob-details-btn span {
                    margin-left: 8px;
                }

                /* EMPTY */

                .myjobs-empty {
                    background: #fff;
                    border: 1px solid #e0e7f0;
                    border-radius: 20px;
                    padding: 70px 25px;
                    text-align: center;
                }

                .empty-icon {
                    width: 58px;
                    height: 58px;
                    border-radius: 17px;
                    background: #edf3ff;
                    color: #2454df;
                    margin: 0 auto 17px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    font-weight: 400;
                }

                .myjobs-empty h2 {
                    margin: 0;
                    color: #142747;
                    font-size: 23px;
                }

                .myjobs-empty p {
                    max-width: 520px;
                    margin: 10px auto 23px;
                    color: #72839d;
                    line-height: 1.6;
                    font-size: 14px;
                }

                /* BOTTOM */

                .myjobs-bottom-action {
                    text-align: center;
                    margin-top: 25px;
                }

                .myjobs-bottom-action button {
                    border: 0;
                    background: transparent;
                    color: #2454df;
                    font-weight: 750;
                    cursor: pointer;
                }

                /* LOADING */

                .myjobs-loading {
                    min-height: 70vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #f6f8fc;
                    color: #607492;
                }

                .loading-spinner {
                    width: 34px;
                    height: 34px;
                    border: 3px solid #dfe7f5;
                    border-top-color: #2454df;
                    border-radius: 50%;
                    animation: myjobs-spin .8s linear infinite;
                    margin-bottom: 14px;
                }

                @keyframes myjobs-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* TABLET */

                @media (max-width: 900px) {

                    .myjobs-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .myjob-card {
                        grid-template-columns: 1fr;
                    }

                    .myjob-side {
                        border-left: 0;
                        border-top: 1px solid #e8edf4;
                        align-items: stretch;
                        text-align: left;
                    }

                    .myjob-price {
                        font-size: 20px;
                    }
                }

                /* MOBILE */

                @media (max-width: 650px) {

                    .myjobs-page {
                        padding: 25px 14px 50px;
                    }

                    .myjobs-header {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .myjobs-header-actions {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                    }

                    .myjobs-home-btn,
                    .myjobs-primary-btn {
                        width: 100%;
                    }

                    .myjobs-stats {
                        grid-template-columns: 1fr 1fr;
                    }

                    .myjobs-toolbar {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .myjobs-tabs {
                        width: 100%;
                    }

                    .myjobs-tab {
                        flex: 1;
                    }

                    .myjob-main {
                        padding: 20px;
                    }

                    .myjob-top {
                        flex-direction: column;
                    }

                    .myjob-status {
                        align-self: flex-start;
                    }
                }

                @media (max-width: 430px) {

                    .myjobs-header-actions {
                        grid-template-columns: 1fr;
                    }

                    .myjobs-tabs {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                    }

                    .myjobs-tab {
                        width: 100%;
                    }
                }

            `}</style>
        </div>
    );
}

export default NyJobs;