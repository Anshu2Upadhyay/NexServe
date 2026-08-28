import api from "./api";


// ======================================================
// NORMALIZE API RESPONSE
// ======================================================

const unwrapResponse = (response) => {
    return response?.data ?? response;
};


// ======================================================
// CUSTOMER REGISTER
// ======================================================

const registerCustomer = async (customerData) => {
    const response = await api.post(
        "/auth/customer/register",
        customerData
    );

    return unwrapResponse(response);
};


// ======================================================
// WORKER REGISTER
// ======================================================

const registerWorker = async (workerData) => {
    const response = await api.post(
        "/auth/worker/register",
        workerData
    );

    return unwrapResponse(response);
};


// ======================================================
// CUSTOMER LOGIN
// ======================================================

const loginCustomer = async (credentials) => {
    const response = await api.post(
        "/auth/customer/login",
        credentials
    );

    return unwrapResponse(response);
};


// ======================================================
// WORKER LOGIN
// ======================================================

const loginWorker = async (credentials) => {
    const response = await api.post(
        "/auth/worker/login",
        credentials
    );

    return unwrapResponse(response);
};


// ======================================================
// SAVE AUTH DATA
// ======================================================

const saveAuthData = (data, role) => {

    if (!data?.token) {
        throw new Error(
            "Authentication successful but token was not received."
        );
    }


    const user =
        role === "worker"
            ? data.worker
            : data.user;


    if (!user) {
        throw new Error(
            "User information was not received."
        );
    }


    const userWithRole = {
        ...user,
        role
    };


    localStorage.setItem(
        "nexserve_token",
        data.token
    );


    localStorage.setItem(
        "nexserve_user",
        JSON.stringify(userWithRole)
    );


    return userWithRole;
};


// ======================================================
// LOGOUT
// ======================================================

const logout = () => {

    localStorage.removeItem(
        "nexserve_token"
    );

    localStorage.removeItem(
        "nexserve_user"
    );
};


// ======================================================
// GET CURRENT USER
// ======================================================

const getCurrentUser = () => {

    const storedUser =
        localStorage.getItem(
            "nexserve_user"
        );


    if (!storedUser) {
        return null;
    }


    try {

        return JSON.parse(
            storedUser
        );

    } catch (error) {

        console.error(
            "Invalid stored user data:",
            error
        );

        localStorage.removeItem(
            "nexserve_user"
        );

        return null;
    }
};


// ======================================================
// GET CURRENT TOKEN
// ======================================================

const getCurrentToken = () => {

    return localStorage.getItem(
        "nexserve_token"
    );
};


// ======================================================
// AUTHENTICATED STATUS
// ======================================================

const isAuthenticated = () => {

    const token =
        getCurrentToken();

    const user =
        getCurrentUser();

    return Boolean(
        token &&
        user
    );
};


// ======================================================
// EXPORTS
// ======================================================

export {
    registerCustomer,
    registerWorker,
    loginCustomer,
    loginWorker,
    saveAuthData,
    logout,
    getCurrentUser,
    getCurrentToken,
    isAuthenticated
};