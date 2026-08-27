import api from "./api";

// Customer dashboard
const getCustomerDashboard = async () => {
    return await api.get("/customers/dashboard");
};

// Customer profile
const getCustomerProfile = async () => {
    return await api.get("/customers/profile");
};

// Customer ke saare jobs
const getMyJobs = async () => {
    return await api.get("/jobs/my-jobs");
};

// Job create karna
const createJob = async (jobData) => {
    return await api.post("/jobs", jobData);
};

// Single job details
const getJobById = async (jobId) => {
    return await api.get(`/jobs/${jobId}`);
};

// Customer payment
const makePayment = async (jobId) => {
    return await api.post(`/jobs/${jobId}/pay`);
};

// Customer rating/review
const rateWorker = async (jobId, rating, review = "") => {
    return await api.post(`/jobs/${jobId}/rate`, {
        rating,
        review
    });
};

// Customer job cancel
const cancelJob = async (jobId, reason = "Cancelled by customer") => {
    return await api.patch(`/jobs/${jobId}/cancel`, {
        reason
    });
};

export {
    getCustomerDashboard,
    getCustomerProfile,
    getMyJobs,
    createJob,
    getJobById,
    makePayment,
    rateWorker,
    cancelJob
};