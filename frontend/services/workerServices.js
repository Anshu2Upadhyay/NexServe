import api from "./api";

// Worker dashboard
const getWorkerDashboard = async () => {
    return await api.get("/workers/dashboard");
};

// Worker profile
const getWorkerProfile = async () => {
    return await api.get("/workers/profile");
};

// Worker online/offline
const updateAvailability = async (isAvailable) => {
    return await api.patch("/workers/availability", {
        isAvailable
    });
};

// Worker current GPS location
const updateLocation = async (latitude, longitude) => {
    return await api.patch("/workers/location", {
        latitude,
        longitude
    });
};

// Nearby / available jobs
const getAvailableJobs = async () => {
    return await api.get("/jobs/available");
};

// Worker ke accepted/current jobs
const getMyJobs = async () => {
    return await api.get("/jobs/my-jobs");
};

// Single job details
const getJobById = async (jobId) => {
    return await api.get(`/jobs/${jobId}`);
};

// Accept job
const acceptJob = async (jobId) => {
    return await api.patch(`/jobs/${jobId}/accept`);
};

// Start travelling to customer
const startTravel = async (jobId) => {
    return await api.patch(`/jobs/${jobId}/start-travel`);
};

// Customer OTP verify
const verifyJobOTP = async (jobId, otp) => {
    return await api.patch(`/jobs/${jobId}/verify-otp`, {
        otp
    });
};

// Final price
const setFinalPrice = async (jobId, finalPrice) => {
    return await api.patch(`/jobs/${jobId}/final-price`, {
        finalPrice
    });
};

// Complete job
const completeJob = async (jobId) => {
    return await api.patch(`/jobs/${jobId}/complete`);
};

// Worker cancel job
const cancelJob = async (
    jobId,
    reason = "Cancelled by worker"
) => {
    return await api.patch(`/jobs/${jobId}/cancel`, {
        reason
    });
};

export {
    getWorkerDashboard,
    getWorkerProfile,
    updateAvailability,
    updateLocation,
    getAvailableJobs,
    getMyJobs,
    getJobById,
    acceptJob,
    startTravel,
    verifyJobOTP,
    setFinalPrice,
    completeJob,
    cancelJob
};