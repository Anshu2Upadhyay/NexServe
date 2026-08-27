import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    getJobById,
    payForJob,
    rateJob
} from "../services/jobService";
import Loader from "../components/Loader";

function Payment() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("mock");

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [rated, setRated] = useState(false);

    useEffect(() => {
        loadJob();
    }, [jobId]);

    const loadJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getJobById(jobId);

            if (!response?.success) {
                throw new Error(
                    response?.message || "Job not found"
                );
            }

            setJob(
                response.job ||
                    response.data?.job ||
                    response.data
            );
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to load payment details."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (amount) => {
        return `₹${Number(amount || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    const handlePayment = async () => {
        if (!job?.finalPrice || Number(job.finalPrice) <= 0) {
            setError("Final price is not available yet.");
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const response = await payForJob(jobId, {
                paymentMethod
            });

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Payment failed."
                );
            }

            await loadJob();
        } catch (err) {
            setError(
                err?.message || "Payment failed."
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleRating = async () => {
        if (!rating) {
            setError("Please select a rating.");
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const response = await rateJob(jobId, {
                rating,
                review: review.trim()
            });

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Unable to submit rating."
                );
            }

            setRated(true);
            await loadJob();
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to submit rating."
            );
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error && !job) {
        return (
            <div className="dashboard-page">
                <button
                    className="back-button"
                    type="button"
                    onClick={() =>
                        navigate("/customer/my-jobs")
                    }
                >
                    ← Back to My Jobs
                </button>

                <div className="error-box">
                    {error}

                    <button
                        type="button"
                        onClick={loadJob}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="dashboard-page">
                <div className="empty-state">
                    <h2>Job not found</h2>
                </div>
            </div>
        );
    }

    const paymentCompleted =
        job.paymentStatus === "paid";

    const jobCompleted =
        job.status === "completed";

    const showRating =
        jobCompleted &&
        paymentCompleted &&
        job.rating == null &&
        !rated;

    const paymentRequired =
        !paymentCompleted &&
        Number(job.finalPrice) > 0;

    return (
        <div className="dashboard-page payment-page">
            <button
                type="button"
                className="back-button"
                onClick={() =>
                    navigate(
                        `/customer/job/${jobId}`
                    )
                }
            >
                ← Back to Job
            </button>

            <div className="dashboard-header">
                <div>
                    <span className="page-eyebrow">
                        NEXSERVE
                    </span>

                    <h1>
                        {paymentCompleted
                            ? "Payment Complete"
                            : "Complete Payment"}
                    </h1>

                    <p>
                        {paymentCompleted
                            ? "Your payment has been recorded successfully."
                            : "Review the final amount before making the payment."}
                    </p>
                </div>
            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            <div className="payment-layout">
                <section className="details-card">
                    <div className="card-heading">
                        <h2>Job Summary</h2>
                    </div>

                    <div className="payment-job">
                        <h3>
                            {job.title ||
                                "Service Job"}
                        </h3>

                        <p>
                            {job.description ||
                                "No description provided."}
                        </p>

                        <div className="job-meta">
                            <span>
                                {job.category ||
                                    "Service"}
                            </span>

                            <span>
                                {job.area ||
                                    job.city ||
                                    "Location"}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="details-card">
                    <div className="card-heading">
                        <h2>Price Breakdown</h2>
                    </div>

                    <div className="price-breakdown">
                        <div>
                            <span>
                                Estimated Range
                            </span>

                            <strong>
                                {formatMoney(
                                    job.estimatedMinPrice
                                )}{" "}
                                –{" "}
                                {formatMoney(
                                    job.estimatedMaxPrice
                                )}
                            </strong>
                        </div>

                        <div className="final-price-row">
                            <span>
                                Final Amount
                            </span>

                            <strong>
                                {formatMoney(
                                    job.finalPrice
                                )}
                            </strong>
                        </div>
                    </div>
                </section>

                {paymentRequired && (
                    <section className="details-card">
                        <div className="card-heading">
                            <h2>Payment Method</h2>
                        </div>

                        <label className="payment-option">
                            <input
                                type="radio"
                                name="payment"
                                value="mock"
                                checked={
                                    paymentMethod ===
                                    "mock"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <div>
                                <strong>
                                    Demo Payment
                                </strong>

                                <small>
                                    Fake payment for
                                    project testing
                                </small>
                            </div>
                        </label>

                        <button
                            type="button"
                            className="primary-button full-width"
                            disabled={processing}
                            onClick={handlePayment}
                        >
                            {processing
                                ? "Processing..."
                                : `Pay ${formatMoney(
                                      job.finalPrice
                                  )}`}
                        </button>
                    </section>
                )}

                {paymentCompleted && (
                    <section className="details-card success-card">
                        <div className="success-icon">
                            ✓
                        </div>

                        <h2>
                            Payment Successful
                        </h2>

                        <p>
                            Your payment of{" "}
                            <strong>
                                {formatMoney(
                                    job.finalPrice
                                )}
                            </strong>{" "}
                            has been recorded.
                        </p>

                        {job.transactionId && (
                            <small>
                                Transaction ID:{" "}
                                {job.transactionId}
                            </small>
                        )}
                    </section>
                )}

                {showRating && (
                    <section className="details-card rating-card">
                        <div className="card-heading">
                            <h2>
                                Rate Your Worker
                            </h2>
                        </div>

                        <p>
                            How was your service
                            experience?
                        </p>

                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(
                                (star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <= rating
                                                ? "star selected"
                                                : "star"
                                        }
                                        onClick={() =>
                                            setRating(
                                                star
                                            )
                                        }
                                    >
                                        ★
                                    </button>
                                )
                            )}
                        </div>

                        <textarea
                            rows="4"
                            placeholder="Write a review (optional)"
                            value={review}
                            onChange={(e) =>
                                setReview(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            type="button"
                            className="primary-button full-width"
                            disabled={processing}
                            onClick={handleRating}
                        >
                            {processing
                                ? "Submitting..."
                                : "Submit Rating"}
                        </button>
                    </section>
                )}

                {jobCompleted &&
                    paymentCompleted &&
                    (job.rating != null || rated) && (
                        <section className="details-card">
                            <div className="card-heading">
                                <h2>
                                    Rating Submitted
                                </h2>
                            </div>

                            <div className="rating-display">
                                <strong>
                                    {"★".repeat(
                                        Number(
                                            job.rating ||
                                                rating
                                        )
                                    )}
                                </strong>

                                <span>
                                    {job.rating ||
                                        rating}
                                    /5
                                </span>
                            </div>

                            {(job.review || review) && (
                                <p>
                                    "
                                    {job.review ||
                                        review}
                                    "
                                </p>
                            )}

                            <button
                                type="button"
                                className="secondary-button full-width"
                                onClick={() =>
                                    navigate(
                                        "/customer/my-jobs"
                                    )
                                }
                            >
                                Back to My Jobs
                            </button>
                        </section>
                    )}
            </div>
        </div>
    );
}

export default Payment;