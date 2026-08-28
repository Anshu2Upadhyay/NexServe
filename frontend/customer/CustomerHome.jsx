import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CustomerHome() {
    const navigate = useNavigate();
    const {
        user,
        logout
    } = useAuth();

    const firstName =
        user?.name
            ?.trim()
            ?.split(/\s+/)[0] ||
        "there";


    // ======================================================
    // SERVICES
    // ======================================================

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


    // ======================================================
    // NAVIGATION
    // ======================================================

    const goHome = () => {
        navigate("/customer/home");
    };


    const goMyJobs = () => {
        navigate("/customer/my-jobs");
    };


    const goDashboard = () => {
        navigate("/customer/dashboard");
    };


    const goPostJob = (service = null) => {

        if (service) {
            navigate(
                "/customer/post-job",
                {
                    state: {
                        service
                    }
                }
            );

            return;
        }

        navigate(
            "/customer/post-job"
        );
    };


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };


    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="customer-home">

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header className="customer-home-nav">

                <button
                    type="button"
                    className="brand"
                    onClick={goHome}
                    aria-label="Go to NexServe home"
                >
                    NEX<span>SERVE</span>
                </button>


                <nav
                    className="home-nav-links"
                    aria-label="Customer navigation"
                >

                    <button
                        type="button"
                        className="nav-link active"
                        onClick={goHome}
                    >
                        Home
                    </button>


                    <button
                        type="button"
                        className="nav-link"
                        onClick={goMyJobs}
                    >
                        My Jobs
                    </button>


                    <button
                        type="button"
                        className="nav-link"
                        onClick={goDashboard}
                    >
                        Dashboard
                    </button>

                </nav>


                <div className="home-nav-right">

                    <button
                        type="button"
                        className="user-chip"
                        onClick={goDashboard}
                        aria-label="Open dashboard"
                    >

                        <div className="user-avatar">
                            {firstName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <span>
                            {firstName}
                        </span>

                    </button>


                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main>

                {/* ==================================================
                    HERO
                ================================================== */}

                <section className="customer-hero">

                    <div className="hero-content">

                        <span className="hero-badge">
                            LOCAL SERVICES • ON DEMAND
                        </span>


                        <h1>
                            What do you need
                            <br />
                            <span>
                                help with today?
                            </span>
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
                                goPostJob()
                            }
                        >
                            + Post a New Job
                        </button>

                    </div>


                    <div
                        className="hero-visual"
                        aria-hidden="true"
                    >

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


                {/* ==================================================
                    SERVICES
                ================================================== */}

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
                                goPostJob()
                            }
                        >
                            View all →
                        </button>

                    </div>


                    <div className="services-grid">

                        {services.map(
                            (service) => (

                                <button
                                    type="button"
                                    className="service-card"
                                    key={
                                        service.title
                                    }
                                    onClick={() =>
                                        goPostJob(
                                            service.title
                                        )
                                    }
                                    aria-label={
                                        `Post a ${service.title} job`
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

                            )
                        )}

                    </div>

                </section>


                {/* ==================================================
                    QUICK ACTIONS
                ================================================== */}

                <section className="quick-actions">

                    <button
                        type="button"
                        className="quick-card"
                        onClick={() =>
                            goPostJob()
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

                    </button>


                    <button
                        type="button"
                        className="quick-card"
                        onClick={goMyJobs}
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

                    </button>

                </section>

            </main>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="customer-home-footer">

                <strong>
                    NEXSERVE
                </strong>

                <span>
                    Local help. Trusted workers.
                </span>

            </footer>

        </div>
    );
}

export default CustomerHome;