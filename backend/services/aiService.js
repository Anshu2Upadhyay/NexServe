const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || "http://localhost:8000";

const AI_REQUEST_TIMEOUT_MS = 5000;


const predictJobDetails = async (description) => {
    let timeout;

    try {
        const controller = new AbortController();
        timeout = setTimeout(
            () => controller.abort(),
            AI_REQUEST_TIMEOUT_MS
        );

        const response = await fetch(
            `${AI_SERVICE_URL}/predict`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ description }),
                signal: controller.signal
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "AI prediction failed"
            );
        }

        return data.prediction;

    } catch (error) {
        console.error(
            "AI Service Error:",
            error.message
        );

        throw new Error("Unable to get AI prediction");
    } finally {
        clearTimeout(timeout);
    }
};


module.exports = {
    predictJobDetails
};
