import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerDashboard } from "../services/customerServices";
import { getCurrentUser } from "../services/authServices";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";

const services = [
    {
        id: "plumbing",
        title: "Plumbing",
        subtitle: "Pipes, taps & leaks",
        icon: "🔧"
    },
    {
        id: "electrical",
        title: "Electrical",
        subtitle: "Fans, switches & wiring",
        icon: "⚡"
    },
    {
        id: "ac",
        title: "AC & Cooling",
        subtitle: "Repair & servicing",
        icon: "❄"
    },
    {
        id: "appliance",
        title: "Appliance",
        subtitle: "Home appliances",
        icon: "🔌"
    },
    {
        id: "carpentry",
        title: "Carpentry",
        subtitle: "Furniture & woodwork",
        icon: "🪚"
    },
    {
        id: "cleaning",
        title: "Cleaning",
        subtitle: "Home & deep cleaning",
        icon: "🧹"
    },
    {
        id: "painting",
        title: "Painting",
        subtitle: "Walls & interiors",
        icon: "🎨"
    },
    {
        id: "general",
        title: "Other Services",
        subtitle: "Something else?",
        icon: "＋"
    }
];

const statusText = {
    posted: "Finding a worker",
    searching: "Finding a worker",
    accepted: "Worker accepted",
    on_the_way: "Worker is on the way",
    traveling: "Worker is on the way",
    arrived: "Worker has arrived",
    in_progress: "Service in progress",
    waiting_payment: "Payment pending",
    completed: "Completed",
    cancelled: "Cancelled"
};

function CustomerDashboard() {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [location, setLocation] = useState(
        user?.area || user?.city || "Your location"
    );

    useEffect(() => {
        loadDashboard();
        detectLocation();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getCustomerDashboard();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Unable to load your home"
                );
            }

            setDashboard(
                response.dashboard || {}
            );
        } catch (err) {
            console.error(
                "Customer home error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load your home"
            );
        } finally {
            setLoading(false);
        }
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const {
                        latitude,
                        longitude
                    } = position.coords;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );

                    if (!response.ok) {
                        return;
                    }

                    const data =
                        await response.json();

                    const address =
                        data.address || {};

                    const area =
                        address.suburb ||
                        address.neighbourhood ||
                        address.residential ||
                        "";

                    const city =
                        address.city ||
                        address.town ||
                        address.municipality ||
                        address.village ||
                        "";

                    setLocation(
                        area && city
                            ? `${area}, ${city}`
                            : city ||
                                  area ||
                                  user?.city ||
                                  "Your location"
                    );
                } catch (err) {
                    console.error(
                        "Location lookup failed:",
                        err
                    );
                }
            },
            () => {
                setLocation(
                    user?.area ||
                        user?.city ||
                        "Your location"
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const recentJobs = useMemo(() => {
        return Array.isArray(
            dashboard?.recentJobs
        )
            ? dashboard.recentJobs
            : [];
    }, [dashboard]);

    const activeJob = useMemo(() => {
        return recentJobs.find((job) =>
            [
                "posted",
                "searching",
                "accepted",
                "on_the_way",
                "traveling",
                "arrived",
                "in_progress",
                "waiting_payment"
            ].includes(job?.status)
        );
    }, [recentJobs]);

    const completedJobs = recentJobs.filter(
        (job) => job?.status === "completed"
    );

    const firstName =
        user?.name?.split(" ")?.[0] ||
        "there";

    const formatMoney = (amount) => {
        return `₹${Number(
            amount || 0
        ).toLocaleString("en-IN")}`;
    };

    const getServiceIcon = (category) => {
        const map = {
            Plumbing: "🔧",
            Electrical: "⚡",
            "AC & Cooling": "❄",
            "Appliance Repair": "🔌",
            Carpentry: "🪚",
            Cleaning: "🧹",
            Painting: "🎨"
        };

        return map[category] || "🛠";
    };

    const getServiceTitle = (job) => {
        if (job?.title) {
            return job.title;
        }

        if (job?.category) {
            return job.category;
        }

        return "Home Service";
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="customer-home">

            {/* =========================
                TOP HEADER
            ========================= */}

            <header className="customer-home-header">

                <div className="customer-location">

                    <div className="location-pin">
                        ⌖
                    </div>

                    <div>
                        <span>
                            SERVICE LOCATION
                        </span>

                        <strong>
                            {location}
                        </strong>
                    </div>

                </div>

                <button
                    type="button"
                    className="profile-button"
                    onClick={() =>
                        navigate(
                            "/customer/profile"
                        )
                    }
                >
                    <span>
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                    </span>
                </button>

            </header>

            {/* =========================
                GREETING
            ========================= */}

            <section className="customer-greeting">

                <div>
                    <p>
                        Good to see you,
                    </p>

                    <h1>
                        {firstName} 👋
                    </h1>
                </div>

            </section>

            {/* =========================
                MAIN BOOKING CARD
            ========================= */}

            <section className="booking-hero">

                <div className="booking-hero-content">

                    <span className="booking-label">
                        NEED SOMETHING FIXED?
                    </span>

                    <h2>
                        What can we help
                        you with?
                    </h2>

                    <p>
                        Book a trusted local
                        professional in just a
                        few steps.
                    </p>

                    <button
                        type="button"
                        className="booking-main-button"
                        onClick={() =>
                            navigate(
                                "/customer/post-job"
                            )
                        }
                    >
                        <span>
                            Tell us what you need
                        </span>

                        <strong>
                            →
                        </strong>
                    </button>

                </div>

                <div className="booking-hero-art">
                    <div className="hero-orbit orbit-one" />
                    <div className="hero-orbit orbit-two" />

                    <div className="hero-tool">
                        🔧
                    </div>

                    <div className="hero-spark spark-one">
                        ✦
                    </div>

                    <div className="hero-spark spark-two">
                        +
                    </div>
                </div>

            </section>

            {/* =========================
                ACTIVE BOOKING
            ========================= */}

            {activeJob && (
                <section className="active-service-card">

                    <div className="active-service-top">

                        <div className="active-service-icon">
                            {getServiceIcon(
                                activeJob.category
                            )}
                        </div>

                        <div className="active-service-title">

                            <span>
                                ACTIVE SERVICE
                            </span>

                            <h3>
                                {getServiceTitle(
                                    activeJob
                                )}
                            </h3>

                        </div>

                        <StatusBadge
                            status={
                                activeJob.status
                            }
                        />

                    </div>

                    <div className="active-service-progress">

                        <div className="progress-line">
                            <span />
                        </div>

                        <div className="active-service-status">

                            <strong>
                                {
                                    statusText[
                                        activeJob
                                            .status
                                    ] ||
                                        "Service in progress"
                                }
                            </strong>

                            <span>
                                {activeJob.area ||
                                    activeJob.city ||
                                    location}
                            </span>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="active-service-button"
                        onClick={() =>
                            navigate(
                                `/customer/job/${
                                    activeJob._id ||
                                    activeJob.id
                                }`
                            )
                        }
                    >
                        Track service
                        <span>→</span>
                    </button>

                </section>
            )}

            {/* =========================
                SERVICES
            ========================= */}

            <section className="services-section">

                <div className="home-section-heading">

                    <div>
                        <span>
                            EXPLORE SERVICES
                        </span>

                        <h2>
                            What do you need?
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/customer/post-job"
                            )
                        }
                    >
                        View all
                    </button>

                </div>

                <div className="service-grid">

                    {services.map((service) => (
                        <button
                            type="button"
                            className="service-tile"
                            key={service.id}
                            onClick={() =>
                                navigate(
                                    "/customer/post-job",
                                    {
                                        state: {
                                            category:
                                                service.title
                                        }
                                    }
                                )
                            }
                        >

                            <div className="service-icon">
                                {service.icon}
                            </div>

                            <strong>
                                {service.title}
                            </strong>

                            <span>
                                {service.subtitle}
                            </span>

                        </button>
                    ))}

                </div>

            </section>

            {/* =========================
                TRUST STRIP
            ========================= */}

            <section className="trust-strip">

                <div>
                    <strong>
                        ✓
                    </strong>

                    <span>
                        Verified workers
                    </span>
                </div>

                <div>
                    <strong>
                        ⚡
                    </strong>

                    <span>
                        Fast matching
                    </span>
                </div>

                <div>
                    <strong>
                        ₹
                    </strong>

                    <span>
                        Fair pricing
                    </span>
                </div>

                <div>
                    <strong>
                        ★
                    </strong>

                    <span>
                        Rated professionals
                    </span>
                </div>

            </section>

            {/* =========================
                RECENT SERVICES
            ========================= */}

            <section className="recent-services-section">

                <div className="home-section-heading">

                    <div>
                        <span>
                            YOUR ACTIVITY
                        </span>

                        <h2>
                            Recent services
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/customer/my-jobs"
                            )
                        }
                    >
                        See all
                    </button>

                </div>

                {recentJobs.length === 0 ? (
                    <div className="no-services-card">

                        <div>
                            🛠
                        </div>

                        <h3>
                            Your services will
                            appear here
                        </h3>

                        <p>
                            Book your first service
                            and we'll keep track of
                            everything for you.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/customer/post-job"
                                )
                            }
                        >
                            Book a service
                        </button>

                    </div>
                ) : (
                    <div className="recent-service-list">

                        {recentJobs
                            .slice(0, 5)
                            .map((job) => {

                                const jobId =
                                    job?._id ||
                                    job?.id;

                                return (
                                    <button
                                        type="button"
                                        className="recent-service-item"
                                        key={jobId}
                                        onClick={() =>
                                            navigate(
                                                `/customer/job/${jobId}`
                                            )
                                        }
                                    >

                                        <div className="recent-service-icon">
                                            {getServiceIcon(
                                                job.category
                                            )}
                                        </div>

                                        <div className="recent-service-info">

                                            <strong>
                                                {getServiceTitle(
                                                    job
                                                )}
                                            </strong>

                                            <span>
                                                {job.area ||
                                                    job.city ||
                                                    "Location unavailable"}
                                            </span>

                                            <small>
                                                {statusText[
                                                    job
                                                        .status
                                                ] ||
                                                    job.status ||
                                                    "Service"}
                                            </small>

                                        </div>

                                        <div className="recent-service-right">

                                            {job.finalPrice >
                                            0
                                                ? formatMoney(
                                                      job.finalPrice
                                                  )
                                                : "—"}

                                            <span>
                                                →
                                            </span>

                                        </div>

                                    </button>
                                );
                            })}

                    </div>
                )}

            </section>

            {/* =========================
                SIMPLE STATS
            ========================= */}

            <section className="customer-mini-stats">

                <div>
                    <span>
                        SERVICES
                    </span>

                    <strong>
                        {dashboard?.statistics
                            ?.totalJobs || 0}
                    </strong>
                </div>

                <div>
                    <span>
                        COMPLETED
                    </span>

                    <strong>
                        {dashboard?.statistics
                            ?.completedJobs || 0}
                    </strong>
                </div>

                <div>
                    <span>
                        TOTAL SPENT
                    </span>

                    <strong>
                        {formatMoney(
                            dashboard?.statistics
                                ?.totalSpending
                        )}
                    </strong>
                </div>

            </section>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="customer-home-error">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={loadDashboard}
                    >
                        Retry
                    </button>

                </div>
            )}

        </div>
    );
}

export default CustomerDashboard;