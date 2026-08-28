import api from "./api";

// ======================================================
// CUSTOMER DASHBOARD
// ======================================================

const getCustomerDashboard = async () => {
    return await api.get("/customers/dashboard");
};

// ======================================================
// CUSTOMER PROFILE
// ======================================================

const getCustomerProfile = async () => {
    return await api.get("/users/profile");
};

const updateCustomerProfile = async (profileData) => {
    return await api.patch(
        "/users/profile",
        profileData
    );
};

// ======================================================
// CUSTOMER JOBS
// ======================================================

// Get all jobs created by logged-in customer
const getMyJobs = async () => {
    return await api.get("/jobs/my-jobs");
};

// Get single job
const getJobById = async (jobId) => {
    if (!jobId) {
        throw new Error("Job ID is required");
    }

    return await api.get(
        `/jobs/${jobId}`
    );
};

// Create new job
const createJob = async (jobData) => {
    return await api.post(
        "/jobs",
        jobData
    );
};

// ======================================================
// JOB CANCELLATION
// ======================================================

const cancelJob = async (
    jobId,
    reason = "Cancelled by customer"
) => {
    if (!jobId) {
        throw new Error("Job ID is required");
    }

    return await api.patch(
        `/jobs/${jobId}/cancel`,
        {
            reason
        }
    );
};

// ======================================================
// PAYMENT
// MINI PROJECT = MOCK PAYMENT
// ======================================================

const makePayment = async (
    jobId,
    paymentMethod = "mock"
) => {
    if (!jobId) {
        throw new Error("Job ID is required");
    }

    return await api.patch(
        `/jobs/${jobId}/payment`,
        {
            paymentMethod
        }
    );
};

// Backward-compatible alias
const payForJob = makePayment;

// ======================================================
// WORKER RATING
// ======================================================

const rateWorker = async (
    jobId,
    rating,
    review = ""
) => {
    if (!jobId) {
        throw new Error("Job ID is required");
    }

    const numericRating =
        Number(rating);

    if (
        !Number.isFinite(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
    ) {
        throw new Error(
            "Rating must be between 1 and 5"
        );
    }

    return await api.patch(
        `/jobs/${jobId}/rate`,
        {
            rating: numericRating,
            review
        }
    );
};

// Backward-compatible alias
const rateJob = rateWorker;

// ======================================================
// EXPORTS
// ======================================================

export {
    getCustomerDashboard,

    getCustomerProfile,
    updateCustomerProfile,

    getMyJobs,
    createJob,
    getJobById,

    cancelJob,

    makePayment,
    payForJob,

    rateWorker,
    rateJob
};