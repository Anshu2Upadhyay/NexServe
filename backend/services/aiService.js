const AI_SERVICE_URL = "http://localhost:8000";


const predictJobDetails = async (description) => {
    try {
        const response = await fetch(
            `${AI_SERVICE_URL}/predict`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description
                })
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

        throw new Error(
            "Unable to get AI prediction"
        );
    }
};


module.exports = {
    predictJobDetails
};