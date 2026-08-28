import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const location = useLocation();

    const { register } = useAuth();

    const [role, setRole] = useState(
        location.state?.role === "worker"
            ? "worker"
            : "customer"
    );

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        city: "",
        area: "",
        skills: "",
        experience: ""
    });

    const [locationData, setLocationData] = useState({
        latitude: null,
        longitude: null
    });

    const [locationStatus, setLocationStatus] =
        useState("Detecting location...");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ======================================================
    // AUTO DETECT LOCATION
    // ======================================================

    useEffect(() => {
        detectLocation();
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus(
                "Location is not supported by this browser."
            );
            return;
        }

        setLocationStatus(
            "Detecting your location..."
        );

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                setLocationData({
                    latitude,
                    longitude
                });

                setLocationStatus(
                    "Location detected"
                );
            },
            () => {
                setLocationData({
                    latitude: null,
                    longitude: null
                });

                setLocationStatus(
                    "Location permission denied. You can continue manually."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    // ======================================================
    // INPUT CHANGE
    // ======================================================

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        if (error) {
            setError("");
        }
    };

    // ======================================================
    // SWITCH ROLE
    // ======================================================

    const switchRole = (newRole) => {
        setRole(newRole);
        setError("");

        setForm((previous) => ({
            ...previous,
            skills: "",
            experience: ""
        }));
    };

    // ======================================================
    // VALIDATION
    // ======================================================

    const validateForm = () => {
        if (!form.name.trim()) {
            return "Please enter your full name.";
        }

        if (!form.email.trim()) {
            return "Please enter your email.";
        }

        if (!form.phone.trim()) {
            return "Please enter your phone number.";
        }

        if (!/^\d{10}$/.test(form.phone.trim())) {
            return "Please enter a valid 10-digit phone number.";
        }

        if (!form.password) {
            return "Please create a password.";
        }

        if (form.password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (!form.city.trim()) {
            return "Please enter your city.";
        }

        if (!form.area.trim()) {
            return "Please enter your area.";
        }

        if (
            role === "worker" &&
            !form.skills.trim()
        ) {
            return "Please enter at least one skill.";
        }

        if (
            role === "worker" &&
            form.experience !== "" &&
            (
                Number.isNaN(
                    Number(form.experience)
                ) ||
                Number(form.experience) < 0
            )
        ) {
            return "Experience cannot be negative.";
        }

        return null;
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setError("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        const payload = {
            name: form.name.trim(),

            email:
                form.email
                    .trim()
                    .toLowerCase(),

            phone:
                form.phone.trim(),

            password:
                form.password,

            city:
                form.city.trim(),

            area:
                form.area.trim()
        };

        // ==================================================
        // LOCATION
        // ==================================================

        if (
            typeof locationData.latitude ===
                "number" &&
            typeof locationData.longitude ===
                "number"
        ) {
            payload.latitude =
                locationData.latitude;

            payload.longitude =
                locationData.longitude;
        }

        // ==================================================
        // WORKER DATA
        // ==================================================

        if (role === "worker") {
            payload.skills =
                form.skills
                    .split(",")
                    .map((skill) =>
                        skill.trim()
                    )
                    .filter(Boolean);

            payload.experience =
                form.experience === ""
                    ? 0
                    : Number(
                        form.experience
                    );
        }

        try {
            setLoading(true);

            const response =
                await register(
                    payload,
                    role
                );

            const registeredUser =
                response?.user ||
                response?.worker ||
                response?.customer;

            const registeredRole =
                response?.role ||
                registeredUser?.role ||
                role;

            // ==================================================
            // REDIRECT
            // ==================================================

            if (
                registeredRole ===
                "worker"
            ) {
                navigate(
                    "/worker/dashboard",
                    {
                        replace: true
                    }
                );
            } else {
                navigate(
                    "/customer/home",
                    {
                        replace: true
                    }
                );
            }

        } catch (err) {
            console.error(
                "Registration error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Registration failed. Please try again.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                {/* HEADER */}
                <div className="auth-header">

                    <div className="auth-logo">
                        N
                    </div>

                    <h1>
                        Create your NexServe account
                    </h1>

                    <p>
                        Choose your account type
                        and get started
                    </p>

                </div>


                {/* ROLE SELECTOR */}
                <div className="role-selector">

                    <button
                        type="button"
                        className={
                            role === "customer"
                                ? "role-option active"
                                : "role-option"
                        }
                        onClick={() =>
                            switchRole(
                                "customer"
                            )
                        }
                        disabled={loading}
                    >
                        Customer
                    </button>

                    <button
                        type="button"
                        className={
                            role === "worker"
                                ? "role-option active"
                                : "role-option"
                        }
                        onClick={() =>
                            switchRole(
                                "worker"
                            )
                        }
                        disabled={loading}
                    >
                        Worker
                    </button>

                </div>


                {/* ERROR */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}


                {/* FORM */}
                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* NAME */}
                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name *
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={
                                handleChange
                            }
                            autoComplete="name"
                            disabled={loading}
                        />

                    </div>


                    {/* EMAIL + PHONE */}
                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="email">
                                Email *
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={
                                    handleChange
                                }
                                autoComplete="email"
                                disabled={loading}
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone *
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                maxLength="10"
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={
                                    handleChange
                                }
                                autoComplete="tel"
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}
                    <div className="form-group">

                        <label htmlFor="password">
                            Password *
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={
                                handleChange
                            }
                            autoComplete="new-password"
                            disabled={loading}
                        />

                        <small>
                            Minimum 6 characters.
                        </small>

                    </div>


                    {/* CITY + AREA */}
                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="city">
                                City *
                            </label>

                            <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="Gorakhpur"
                                value={form.city}
                                onChange={
                                    handleChange
                                }
                                disabled={loading}
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="area">
                                Area *
                            </label>

                            <input
                                id="area"
                                name="area"
                                type="text"
                                placeholder="Pipraich"
                                value={form.area}
                                onChange={
                                    handleChange
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* WORKER FIELDS */}
                    {role === "worker" && (
                        <>
                            <div className="form-group">

                                <label htmlFor="skills">
                                    Skills *
                                </label>

                                <input
                                    id="skills"
                                    name="skills"
                                    type="text"
                                    placeholder="Plumber, Electrician"
                                    value={form.skills}
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                                <small>
                                    Separate multiple
                                    skills with commas.
                                </small>

                            </div>


                            <div className="form-group">

                                <label htmlFor="experience">
                                    Experience (years)
                                </label>

                                <input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="2"
                                    value={
                                        form.experience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </div>
                        </>
                    )}


                    {/* LOCATION */}
                    <div className="location-box">

                        <div>

                            <strong>
                                Current Location
                            </strong>

                            <span>
                                {locationStatus}
                            </span>

                        </div>

                        <button
                            type="button"
                            onClick={
                                detectLocation
                            }
                            disabled={loading}
                        >
                            Detect Again
                        </button>

                    </div>


                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : `Create ${
                                role === "worker"
                                    ? "Worker"
                                    : "Customer"
                            } Account`}
                    </button>

                </form>


                {/* FOOTER */}
                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/login",
                                {
                                    state: {
                                        role
                                    }
                                }
                            )
                        }
                        disabled={loading}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;