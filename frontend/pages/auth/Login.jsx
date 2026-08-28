import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const {
        login,
        loading
    } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "customer"
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const email =
            formData.email.trim();

        const password =
            formData.password;

        if (!email || !password) {
            setError(
                "Email aur password required hai."
            );
            return;
        }

        try {
            const result = await login(
                email,
                password,
                formData.role
            );

            if (!result?.success) {
                setError(
                    result?.message ||
                    "Login failed. Please try again."
                );
                return;
            }

            const user =
                result.user ||
                result.worker ||
                result.customer;

            const role =
                result.role ||
                user?.role ||
                formData.role;

            if (role === "worker") {
                navigate(
                    "/worker/dashboard",
                    { replace: true }
                );
            } else {
                navigate(
                    "/customer/home",
                    { replace: true }
                );
            }

        } catch (err) {
            console.error(
                "Login error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to login. Please try again."
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <h1>NexServe</h1>

                    <p>
                        Login to your account
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label>
                            Login as
                        </label>

                        <div className="role-selector">

                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="customer"
                                    checked={
                                        formData.role ===
                                        "customer"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <span>
                                    Customer
                                </span>
                            </label>


                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="worker"
                                    checked={
                                        formData.role ===
                                        "worker"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <span>
                                    Worker
                                </span>
                            </label>

                        </div>
                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                <div className="auth-footer">
                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create account
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default Login;