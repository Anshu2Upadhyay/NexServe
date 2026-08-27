import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [role, setRole] = useState(
        location.state?.role || "customer"
    );

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.email || !form.password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await login(
                form.email.trim().toLowerCase(),
                form.password,
                role
            );

            const loggedInUser = response.user;

            if (loggedInUser?.role === "worker") {
                navigate("/worker", {
                    replace: true
                });
            } else {
                navigate("/customer/home", {
                    replace: true
                });
            }
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">N</div>

                    <h1>Welcome to NexServe</h1>

                    <p>
                        Login to continue to your account
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
                        onClick={() => {
                            setRole("customer");
                            setError("");
                        }}
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
                        onClick={() => {
                            setRole("worker");
                            setError("");
                        }}
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
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
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
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : `Login as ${
                                  role === "worker"
                                      ? "Worker"
                                      : "Customer"
                              }`}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register", {
                                state: { role }
                            })
                        }
                    >
                        Create account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;