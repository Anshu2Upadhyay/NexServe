import api from "./api";


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


const getMyJobs = getCustomerJobs;


const getAvailableJobs = async () => {

    return await api.get(
        "/jobs/available"
    );
};


const getWorkerJobs = async () => {

    return await api.get(
        "/jobs/worker/my-jobs"
    );
};


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


const verifyJobOTP = verifyOTP;


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


const makePayment = payForJob;


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


export {
    createJob,
    getJobById,
    getCustomerJobs,
    getMyJobs,
    getAvailableJobs,
    getWorkerJobs,
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