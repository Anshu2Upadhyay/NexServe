import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CustomerHome() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const firstName =
        user?.name?.split(" ")[0] || "there";

    const services = [
        {
            icon: "🔧",
            title: "Plumber",
            text: "Pipes, taps, leakage & repairs"
        },
        {
            icon: "⚡",
            title: "Electrician",
            text: "Wiring, switches & electrical work"
        },
        {
            icon: "🧹",
            title: "Cleaning",
            text: "Home & deep cleaning services"
        },
        {
            icon: "❄️",
            title: "AC Service",
            text: "Repair, installation & maintenance"
        },
        {
            icon: "🛠️",
            title: "Appliance Repair",
            text: "Fix your home appliances"
        },
        {
            icon: "🚚",
            title: "Moving & Delivery",
            text: "Local shifting and delivery help"
        }
    ];

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="customer-home">

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="customer-home-nav">

                <div
                    className="brand"
                    onClick={() =>
                        navigate("/customer/home")
                    }
                >
                    NEX<span>SERVE</span>
                </div>

                <nav className="home-nav-links">

                    <button
                        type="button"
                        className="nav-link active"
                        onClick={() =>
                            navigate("/customer/home")
                        }
                    >
                        Home
                    </button>

                    <button
                        type="button"
                        className="nav-link"
                        onClick={() =>
                            navigate("/customer/my-jobs")
                        }
                    >
                        My Jobs
                    </button>

                    <button
                        type="button"
                        className="nav-link"
                        onClick={() =>
                            navigate("/customer/dashboard")
                        }
                    >
                        Dashboard
                    </button>

                </nav>

                <div className="home-nav-right">

                    <div className="user-chip">
                        <div className="user-avatar">
                            {firstName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <span>
                            {firstName}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =========================
                HERO
            ========================= */}

            <main>

                <section className="customer-hero">

                    <div className="hero-content">

                        <span className="hero-badge">
                            LOCAL SERVICES • ON DEMAND
                        </span>

                        <h1>
                            What do you need
                            <br />
                            <span>help with today?</span>
                        </h1>

                        <p>
                            Tell us what you need and
                            NexServe will connect you with
                            a trusted local professional.
                        </p>

                        <button
                            type="button"
                            className="hero-primary-button"
                            onClick={() =>
                                navigate(
                                    "/customer/post-job"
                                )
                            }
                        >
                            + Post a New Job
                        </button>

                    </div>

                    <div className="hero-visual">

                        <div className="hero-circle">
                            <div className="hero-card">

                                <span className="hero-card-icon">
                                    ✓
                                </span>

                                <div>
                                    <strong>
                                        Worker found
                                    </strong>

                                    <small>
                                        Nearby professional
                                    </small>
                                </div>

                            </div>

                            <div className="hero-floating-card">
                                <strong>
                                    Fast & Reliable
                                </strong>
                                <span>
                                    Local workers near you
                                </span>
                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================
                    SERVICES
                ========================= */}

                <section className="services-section">

                    <div className="section-heading">

                        <div>
                            <span>
                                EXPLORE SERVICES
                            </span>

                            <h2>
                                What can we help you with?
                            </h2>

                            <p>
                                Choose a service or tell us
                                exactly what you need.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="view-all-button"
                            onClick={() =>
                                navigate(
                                    "/customer/post-job"
                                )
                            }
                        >
                            View all →
                        </button>

                    </div>


                    <div className="services-grid">

                        {services.map((service) => (
                            <button
                                type="button"
                                className="service-card"
                                key={service.title}
                                onClick={() =>
                                    navigate(
                                        "/customer/post-job",
                                        {
                                            state: {
                                                service:
                                                    service.title
                                            }
                                        }
                                    )
                                }
                            >

                                <div className="service-icon">
                                    {service.icon}
                                </div>

                                <div className="service-info">

                                    <h3>
                                        {service.title}
                                    </h3>

                                    <p>
                                        {service.text}
                                    </p>

                                </div>

                                <span className="service-arrow">
                                    →
                                </span>

                            </button>
                        ))}

                    </div>

                </section>


                {/* =========================
                    QUICK ACTIONS
                ========================= */}

                <section className="quick-actions">

                    <div
                        className="quick-card"
                        onClick={() =>
                            navigate(
                                "/customer/post-job"
                            )
                        }
                    >

                        <div className="quick-icon">
                            +
                        </div>

                        <div>
                            <h3>
                                Need something else?
                            </h3>

                            <p>
                                Describe your problem and
                                we'll find the right worker.
                            </p>
                        </div>

                        <span>
                            →
                        </span>

                    </div>


                    <div
                        className="quick-card"
                        onClick={() =>
                            navigate(
                                "/customer/my-jobs"
                            )
                        }
                    >

                        <div className="quick-icon">
                            ▣
                        </div>

                        <div>
                            <h3>
                                Track your jobs
                            </h3>

                            <p>
                                Check worker status,
                                payments and job history.
                            </p>
                        </div>

                        <span>
                            →
                        </span>

                    </div>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="customer-home-footer">

                <strong>NEXSERVE</strong>

                <span>
                    Local help. Trusted workers.
                </span>

            </footer>

        </div>
    );
}

export default CustomerHome;