const API_BASE_URL = "http://localhost:5000/api";

const getToken = () => {
    return localStorage.getItem("nexserve_token");
};

const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        ...(options.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    let data;

    try {
        data = await response.json();
    } catch {
        data = {
            success: false,
            message: "Invalid server response"
        };
    }

    if (!response.ok) {
        const error = new Error(
            data.message || `Request failed (${response.status})`
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};

const api = {
    get: (endpoint) =>
        apiRequest(endpoint, {
            method: "GET"
        }),

    post: (endpoint, body) =>
        apiRequest(endpoint, {
            method: "POST",
            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body)
        }),

    patch: (endpoint, body) =>
        apiRequest(endpoint, {
            method: "PATCH",
            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body)
        }),

    put: (endpoint, body) =>
        apiRequest(endpoint, {
            method: "PUT",
            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body)
        }),

    delete: (endpoint) =>
        apiRequest(endpoint, {
            method: "DELETE"
        })
};

export { API_BASE_URL, getToken };
export default api;