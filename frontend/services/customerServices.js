import api from "./api";

const getCustomerDashboard = async () => {
    return await api.get("/customers/dashboard");
};

const getCustomerProfile = async () => {
    return await api.get("/users/profile");
};

const updateCustomerProfile = async (profileData) => {
    return await api.patch("/users/profile", profileData);
};

const getMyJobs = async () => {
    return await api.get("/jobs/my-jobs");
};

const createJob = async (jobData) => {
    return await api.post("/jobs", jobData);
};

const getJobById = async (jobId) => {
    return await api.get(`/jobs/${jobId}`);
};

const cancelJob = async (jobId, reason = "Cancelled by customer") => {
    return await api.patch(`/jobs/${jobId}/cancel`, {
        reason
    });
};

const makePayment = async (jobId, paymentMethod = "mock") => {
    return await api.patch(`/jobs/${jobId}/payment`, {
        paymentMethod
    });
};

const payForJob = makePayment;

const rateWorker = async (jobId, rating, review = "") => {
    return await api.patch(`/jobs/${jobId}/rate`, {
        rating,
        review
    });
};

const rateJob = rateWorker;

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