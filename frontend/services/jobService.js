import api from "./api";

// ======================================================
// CUSTOMER
// ======================================================

const createJob = async (
    jobData
) => {
    return await api.post(
        "/jobs",
        jobData
    );
};

const getJobById = async (
    jobId
) => {
    return await api.get(
        `/jobs/${jobId}`
    );
};

const getCustomerJobs = async () => {
    return await api.get(
        "/jobs/my-jobs"
    );
};

const getMyJobs =
    getCustomerJobs;

// ======================================================
// WORKER
// ======================================================

const getAvailableJobs = async () => {
    return await api.get(
        "/jobs/available"
    );
};

const getWorkerJobById = async (
    jobId
) => {
    return await api.get(
        `/jobs/worker/${jobId}`
    );
};

// Backward-compatible alias.
// Existing components using getWorkerJobs()
// won't crash because this function now
// returns available worker jobs.
const getWorkerJobs =
    getAvailableJobs;

// ======================================================
// JOB ACTIONS
// ======================================================

const acceptJob = async (
    jobId
) => {
    return await api.patch(
        `/jobs/${jobId}/accept`,
        {}
    );
};

const startTravel = async (
    jobId
) => {
    return await api.patch(
        `/jobs/${jobId}/on-the-way`,
        {}
    );
};

const verifyOTP = async (
    jobId,
    otp
) => {
    return await api.patch(
        `/jobs/${jobId}/verify-otp`,
        {
            otp
        }
    );
};

const verifyJobOTP =
    verifyOTP;

const setFinalPrice = async (
    jobId,
    finalPrice
) => {
    return await api.patch(
        `/jobs/${jobId}/final-price`,
        {
            finalPrice
        }
    );
};

// ======================================================
// PAYMENT
// ======================================================

const payForJob = async (
    jobId,
    paymentMethod = "mock"
) => {
    return await api.patch(
        `/jobs/${jobId}/payment`,
        {
            paymentMethod
        }
    );
};

const makePayment =
    payForJob;

// ======================================================
// COMPLETE / CANCEL / RATE
// ======================================================

const completeJob = async (
    jobId
) => {
    return await api.patch(
        `/jobs/${jobId}/complete`,
        {}
    );
};

const cancelJob = async (
    jobId,
    reason = "Cancelled"
) => {
    return await api.patch(
        `/jobs/${jobId}/cancel`,
        {
            reason
        }
    );
};

const rateJob = async (
    jobId,
    rating,
    review = ""
) => {
    return await api.patch(
        `/jobs/${jobId}/rate`,
        {
            rating,
            review
        }
    );
};

// ======================================================
// EXPORTS
// ======================================================

export {
    createJob,

    getJobById,

    getCustomerJobs,
    getMyJobs,

    getAvailableJobs,
    getWorkerJobs,
    getWorkerJobById,

    acceptJob,
    startTravel,

    verifyOTP,
    verifyJobOTP,

    setFinalPrice,

    payForJob,
    makePayment,

    completeJob,
    cancelJob,
    rateJob
};