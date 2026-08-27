import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();

    const [role, setRole] = useState(
        location.state?.role || "customer"
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

    const [locationStatus, setLocationStatus] = useState(
        "Detecting location..."
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

        setLocationStatus("Detecting your location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationData({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                setLocationStatus("Location detected");
            },
            () => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const switchRole = (newRole) => {
        setRole(newRole);
        setError("");

        setForm((previous) => ({
            ...previous,
            skills: "",
            experience: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.password ||
            !form.city.trim() ||
            !form.area.trim()
        ) {
            setError("Please fill all required fields.");
            return;
        }

        if (role === "worker" && !form.skills.trim()) {
            setError("Please enter at least one skill.");
            return;
        }

        const payload = {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            password: form.password,
            city: form.city.trim(),
            area: form.area.trim()
        };

        if (
            locationData.latitude !== null &&
            locationData.longitude !== null
        ) {
            payload.latitude = locationData.latitude;
            payload.longitude = locationData.longitude;
        }

        if (role === "worker") {
            payload.skills = form.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);

            payload.experience = Number(form.experience) || 0;
        }

        try {
            setLoading(true);

            const response = await register(
                payload,
                role
            );

            const registeredUser = response.user;

            if (registeredUser?.role === "worker") {
                navigate("/worker", {
                    replace: true
                });
            } else {
                navigate("/customer", {
                    replace: true
                });
            }
        } catch (err) {
            setError(
                err?.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-card">
                <div className="auth-header">
                    <div className="auth-logo">N</div>

                    <h1>Create your NexServe account</h1>

                    <p>
                        Choose your account type and get started
                    </p>
                </div>

                <div className="role-selector">
                    <button
                        type="button"
                        className={
                            role === "customer"
                                ? "role-option active"
                                : "role-option"
                        }
                        onClick={() =>
                            switchRole("customer")
                        }
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
                            switchRole("worker")
                        }
                    >
                        Worker
                    </button>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
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
                            onChange={handleChange}
                            autoComplete="name"
                        />
                    </div>

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
                                onChange={handleChange}
                                autoComplete="email"
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
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                            />
                        </div>
                    </div>

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
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

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
                                onChange={handleChange}
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
                                onChange={handleChange}
                            />
                        </div>
                    </div>

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
                                    onChange={handleChange}
                                />

                                <small>
                                    Separate multiple skills
                                    with commas.
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
                                    placeholder="2"
                                    value={form.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

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
                            onClick={detectLocation}
                        >
                            Detect Again
                        </button>
                    </div>

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

                <div className="auth-footer">
                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login", {
                                state: { role }
                            })
                        }
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;