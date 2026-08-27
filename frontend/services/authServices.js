import api from "./api";


const registerCustomer = async (
    customerData
) => {

    return await api.post(
        "/auth/customer/register",
        customerData
    );
};


const registerWorker = async (
    workerData
) => {

    return await api.post(
        "/auth/worker/register",
        workerData
    );
};


const loginCustomer = async (
    credentials
) => {

    return await api.post(
        "/auth/customer/login",
        credentials
    );
};


const loginWorker = async (
    credentials
) => {

    return await api.post(
        "/auth/worker/login",
        credentials
    );
};


const saveAuthData = (
    data,
    role
) => {

    if (!data?.token) {

        throw new Error(
            "Login successful but token was not received"
        );
    }


    const user =
        role === "worker"
            ? data.worker
            : data.user;


    if (!user) {

        throw new Error(
            "User information was not received"
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


const logout = () => {

    localStorage.removeItem(
        "nexserve_token"
    );

    localStorage.removeItem(
        "nexserve_user"
    );
};


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

    } catch {

        localStorage.removeItem(
            "nexserve_user"
        );

        return null;
    }
};


const getCurrentToken = () => {

    return localStorage.getItem(
        "nexserve_token"
    );
};


const isAuthenticated = () => {

    return Boolean(
        getCurrentToken() &&
        getCurrentUser()
    );
};


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