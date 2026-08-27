import api from "./api";

// Get single job
const getJobById = async (jobId) => {
    return await api.get(`/jobs/${jobId}`);
};

// Create new job
const createJob = async (jobData) => {
    return await api.post("/jobs", jobData);
};

// Get customer's jobs
const getCustomerJobs = async () => {
    return await api.get("/jobs/my-jobs");
};

// Get worker's available jobs
const getAvailableJobs = async () => {
    return await api.get("/jobs/available");
};

// Get worker's accepted/current jobs
const getWorkerJobs = async () => {
    return await api.get("/jobs/my-jobs");
};

// Accept job
const acceptJob = async (jobId) => {
    return await api.patch(`/jobs/${jobId}/accept`);
};

// Start travel
const startTravel = async (jobId) => {
    return await api.patch(`/jobs/${jobId}/start-travel`);
};

// Verify customer OTP
const verifyOTP = async (jobId, otp) => {
    return await api.patch(`/jobs/${jobId}/verify-otp`, {
        otp
    });
};

// Set final price
const setFinalPrice = async (jobId, finalPrice) => {
    return await api.patch(`/jobs/${jobId}/final-price`, {
        finalPrice
    });
};

// Make payment
const makePayment = async (jobId) => {
    return await api.post(`/jobs/${jobId}/pay`);
};

// Complete job
const completeJob = async (jobId) => {
    return await api.patch(`/jobs/${jobId}/complete`);
};

// Cancel job
const cancelJob = async (jobId, reason) => {
    return await api.patch(`/jobs/${jobId}/cancel`, {
        reason
    });
};

// Rate worker
const rateJob = async (jobId, rating, review) => {
    return await api.post(`/jobs/${jobId}/rate`, {
        rating,
        review
    });
};

export {
    getJobById,
    createJob,
    getCustomerJobs,
    getAvailableJobs,
    getWorkerJobs,
    acceptJob,
    startTravel,
    verifyOTP,
    setFinalPrice,
    makePayment,
    completeJob,
    cancelJob,
    rateJob
};