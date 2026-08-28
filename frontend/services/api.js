// ======================================================
// API CONFIGURATION
// ======================================================
//
// Local development:
// VITE_API_URL=http://localhost:5000/api
//
// Production:
// VITE_API_URL=https://your-backend-domain.com/api
//
// If VITE_API_URL is not provided,
// localhost backend will be used.
// ======================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


// ======================================================
// TOKEN
// ======================================================

const getToken = () => {
    return localStorage.getItem(
        "nexserve_token"
    );
};


// ======================================================
// CLEAR AUTH DATA
// ======================================================

const clearAuthData = () => {
    localStorage.removeItem(
        "nexserve_token"
    );

    localStorage.removeItem(
        "nexserve_user"
    );
};


// ======================================================
// API REQUEST
// ======================================================

const apiRequest = async (
    endpoint,
    options = {}
) => {

    const token =
        getToken();

    const isFormData =
        options.body instanceof FormData;


    const headers = {
        ...(isFormData
            ? {}
            : {
                "Content-Type":
                    "application/json"
            }),

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`
            }
            : {}),

        ...(options.headers || {})
    };


    let response;


    // ==================================================
    // NETWORK REQUEST
    // ==================================================

    try {

        response =
            await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    ...options,
                    headers
                }
            );

    } catch (error) {

        const networkError =
            new Error(
                "Unable to connect to server. Make sure backend is running."
            );

        networkError.status = 0;
        networkError.data = null;

        throw networkError;
    }


    // ==================================================
    // RESPONSE PARSING
    // ==================================================

    let data = null;

    const contentType =
        response.headers.get(
            "content-type"
        );


    try {

        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        } else {

            const text =
                await response.text();

            data = {
                success:
                    response.ok,

                message:
                    text ||
                    (
                        response.ok
                            ? "Request completed successfully."
                            : "Request failed."
                    )
            };
        }

    } catch (error) {

        data = {
            success: false,
            message:
                "Invalid server response."
        };
    }


    // ==================================================
    // AUTH FAILURE
    // ==================================================

    if (
        response.status === 401
    ) {

        clearAuthData();
    }


    // ==================================================
    // ERROR RESPONSE
    // ==================================================

    if (!response.ok) {

        const error =
            new Error(
                data?.message ||
                `Request failed (${response.status})`
            );

        error.status =
            response.status;

        error.data =
            data;

        throw error;
    }


    // ==================================================
    // SUCCESS
    // ==================================================

    return data;
};


// ======================================================
// API METHODS
// ======================================================

const api = {

    get: (
        endpoint
    ) => {

        return apiRequest(
            endpoint,
            {
                method: "GET"
            }
        );
    },


    post: (
        endpoint,
        body = {}
    ) => {

        return apiRequest(
            endpoint,
            {
                method: "POST",

                body:
                    body instanceof FormData
                        ? body
                        : JSON.stringify(body)
            }
        );
    },


    patch: (
        endpoint,
        body = {}
    ) => {

        return apiRequest(
            endpoint,
            {
                method: "PATCH",

                body:
                    body instanceof FormData
                        ? body
                        : JSON.stringify(body)
            }
        );
    },


    put: (
        endpoint,
        body = {}
    ) => {

        return apiRequest(
            endpoint,
            {
                method: "PUT",

                body:
                    body instanceof FormData
                        ? body
                        : JSON.stringify(body)
            }
        );
    },


    delete: (
        endpoint
    ) => {

        return apiRequest(
            endpoint,
            {
                method: "DELETE"
            }
        );
    }
};


// ======================================================
// EXPORTS
// ======================================================

export {
    API_BASE_URL,
    getToken
};

export default api;