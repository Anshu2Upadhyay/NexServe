import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/customerService";

const categories = {
    Plumbing: ["Plumber"],
    Electrical: ["Electrician"],
    "Appliance Repair": ["Electrician", "Technician"],
    Carpentry: ["Carpenter"],
    Painting: ["Painter"],
    Cleaning: ["Cleaner"],
    "AC & Cooling": ["Technician", "Electrician"],
    "General Service": ["General"]
};

const basePrices = {
    Plumbing: [300, 600],
    Electrical: [300, 700],
    "Appliance Repair": [400, 1000],
    Carpentry: [500, 1500],
    Painting: [500, 2000],
    Cleaning: [250, 800],
    "AC & Cooling": [400, 1200],
    "General Service": [300, 800]
};

function PostJob() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Plumbing",
        requiredSkill: "Plumber",
        city: "",
        area: "",
        urgency: "normal",
        bookingType: "instant",
        budgetType: "ai"
    });

    const [location, setLocation] = useState({
        latitude: null,
        longitude: null
    });

    const [locationStatus, setLocationStatus] = useState(
        "Detecting your location..."
    );

    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const [imagePreview, setImagePreview] = useState("");
    const [videoPreview, setVideoPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const skills = categories[form.category] || ["General"];

    const estimatedPrice = useMemo(() => {
        const range = basePrices[form.category] || [300, 800];

        if (form.urgency === "urgent") {
            return {
                min: Math.round(range[0] * 1.2),
                max: Math.round(range[1] * 1.2)
            };
        }

        if (form.urgency === "emergency") {
            return {
                min: Math.round(range[0] * 1.5),
                max: Math.round(range[1] * 1.5)
            };
        }

        return {
            min: range[0],
            max: range[1]
        };
    }, [form.category, form.urgency]);

    useEffect(() => {
        detectLocation();
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus(
                "Location is not supported by this browser."
            );
            return;
        }

        setLocationStatus("Detecting location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = Number(
                    position.coords.latitude
                );

                const longitude = Number(
                    position.coords.longitude
                );

                setLocation({
                    latitude,
                    longitude
                });

                setLocationStatus("Location detected");

                reverseGeocode(latitude, longitude);
            },
            () => {
                setLocationStatus(
                    "Location permission denied"
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            const address = data.address || {};

            const detectedCity =
                address.city ||
                address.town ||
                address.municipality ||
                address.village ||
                "";

            const detectedArea =
                address.suburb ||
                address.neighbourhood ||
                address.residential ||
                address.city_district ||
                "";

            setForm((previous) => ({
                ...previous,
                city:
                    previous.city ||
                    detectedCity,
                area:
                    previous.area ||
                    detectedArea
            }));
        } catch {
            // GPS still works even if reverse geocoding fails.
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        const firstSkill =
            categories[category]?.[0] || "General";

        setForm((previous) => ({
            ...previous,
            category,
            requiredSkill: firstSkill
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image should be smaller than 5 MB.");
            return;
        }

        setError("");
        setImageFile(file);

        const url = URL.createObjectURL(file);
        setImagePreview(url);
    };

    const handleVideoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("video/")) {
            setError("Please select a valid video.");
            return;
        }

        if (file.size > 30 * 1024 * 1024) {
            setError("Video should be smaller than 30 MB.");
            return;
        }

        setError("");
        setVideoFile(file);

        const url = URL.createObjectURL(file);
        setVideoPreview(url);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.title.trim()) {
            setError("Please enter what service you need.");
            return;
        }

        if (!form.description.trim()) {
            setError(
                "Please briefly describe the problem."
            );
            return;
        }

        if (!form.city.trim() || !form.area.trim()) {
            setError(
                "Please confirm your city and area."
            );
            return;
        }

        if (
            location.latitude === null ||
            location.longitude === null
        ) {
            setError(
                "Please allow location access before posting the job."
            );
            return;
        }

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            requiredSkill: form.requiredSkill,
            city: form.city.trim(),
            area: form.area.trim(),
            urgency: form.urgency,
            bookingType: form.bookingType,
            latitude: location.latitude,
            longitude: location.longitude,
            estimatedMinPrice: estimatedPrice.min,
            estimatedMaxPrice: estimatedPrice.max,
            image: imageFile ? imageFile.name : ""
        };

        try {
            setLoading(true);

            const response = await createJob(payload);

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Unable to create job."
                );
            }

            const job =
                response.job ||
                response.data?.job ||
                response.data;

            setSuccess("Job posted successfully.");

            if (job?._id || job?.id) {
                setTimeout(() => {
                    navigate(
                        `/customer/job/${
                            job._id || job.id
                        }`
                    );
                }, 500);
            } else {
                setTimeout(() => {
                    navigate("/customer/my-jobs");
                }, 500);
            }
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to post job. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page post-job-page">
            <div className="dashboard-header">
                <div>
                    <span className="page-eyebrow">
                        NEXSERVE
                    </span>

                    <h1>Post a New Job</h1>

                    <p>
                        Tell us what you need and we'll find
                        the right worker.
                    </p>
                </div>
            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-box">
                    {success}
                </div>
            )}

            <form
                className="post-job-form"
                onSubmit={handleSubmit}
            >
                <section className="form-section">
                    <div className="section-header">
                        <div>
                            <h2>What do you need?</h2>
                            <p>
                                Keep it simple. We'll handle
                                the matching.
                            </p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">
                            Service required *
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Bathroom pipe leaking"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            What's the problem? *
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Briefly describe the problem..."
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">
                                Category *
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={
                                    handleCategoryChange
                                }
                            >
                                {Object.keys(categories).map(
                                    (category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="requiredSkill">
                                Required skill *
                            </label>

                            <select
                                id="requiredSkill"
                                name="requiredSkill"
                                value={
                                    form.requiredSkill
                                }
                                onChange={handleChange}
                            >
                                {skills.map((skill) => (
                                    <option
                                        key={skill}
                                        value={skill}
                                    >
                                        {skill}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <div className="section-header">
                        <div>
                            <h2>Photos & Video</h2>
                            <p>
                                Show the worker what needs
                                to be fixed.
                            </p>
                        </div>
                    </div>

                    <div className="upload-grid">
                        <label className="upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                                hidden
                            />

                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Job preview"
                                    className="upload-preview"
                                />
                            ) : (
                                <>
                                    <span className="upload-icon">
                                        +
                                    </span>

                                    <strong>
                                        Add Photo
                                    </strong>

                                    <small>
                                        JPG, PNG up to 5 MB
                                    </small>
                                </>
                            )}
                        </label>

                        <label className="upload-box">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={
                                    handleVideoChange
                                }
                                hidden
                            />

                            {videoPreview ? (
                                <video
                                    src={videoPreview}
                                    className="upload-preview"
                                    controls
                                />
                            ) : (
                                <>
                                    <span className="upload-icon">
                                        +
                                    </span>

                                    <strong>
                                        Add Video
                                    </strong>

                                    <small>
                                        Video up to 30 MB
                                    </small>
                                </>
                            )}
                        </label>
                    </div>

                    {(imageFile || videoFile) && (
                        <div className="selected-files">
                            {imageFile && (
                                <div>
                                    <span>
                                        📷{" "}
                                        {imageFile.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            removeImage
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {videoFile && (
                                <div>
                                    <span>
                                        🎥{" "}
                                        {videoFile.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            removeVideo
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <section className="form-section">
                    <div className="section-header">
                        <div>
                            <h2>Location</h2>
                            <p>
                                We'll use your location to
                                find nearby workers.
                            </p>
                        </div>
                    </div>

                    <div className="location-detect-card">
                        <div>
                            <strong>
                                📍 Current Location
                            </strong>

                            <span>
                                {locationStatus}
                            </span>

                            {location.latitude !== null && (
                                <small>
                                    GPS:{" "}
                                    {location.latitude.toFixed(
                                        5
                                    )}
                                    ,{" "}
                                    {location.longitude.toFixed(
                                        5
                                    )}
                                </small>
                            )}
                        </div>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={detectLocation}
                        >
                            Detect Again
                        </button>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">
                                City *
                            </label>

                            <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="Detected city"
                                value={form.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="area">
                                Area *
                            </label>

                            <input
                                id="area"
                                name="area"
                                type="text"
                                placeholder="Detected area"
                                value={form.area}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <div className="section-header">
                        <div>
                            <h2>Service & Price</h2>
                            <p>
                                NexServe estimates the initial
                                service range.
                            </p>
                        </div>
                    </div>

                    <div className="price-estimate-card">
                        <div>
                            <span>
                                Estimated service price
                            </span>

                            <strong>
                                ₹
                                {estimatedPrice.min.toLocaleString(
                                    "en-IN"
                                )}{" "}
                                – ₹
                                {estimatedPrice.max.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                            <small>
                                Final price can change after
                                the worker checks the job.
                            </small>
                        </div>

                        <span className="ai-label">
                            AI Estimate
                        </span>
                    </div>

                    <div className="budget-options">
                        <label
                            className={
                                form.budgetType === "ai"
                                    ? "budget-option active"
                                    : "budget-option"
                            }
                        >
                            <input
                                type="radio"
                                name="budgetType"
                                value="ai"
                                checked={
                                    form.budgetType ===
                                    "ai"
                                }
                                onChange={handleChange}
                            />

                            <span>
                                <strong>
                                    Let NexServe decide
                                </strong>

                                <small>
                                    Best price based on
                                    the job.
                                </small>
                            </span>
                        </label>

                        <label
                            className={
                                form.budgetType ===
                                "flexible"
                                    ? "budget-option active"
                                    : "budget-option"
                            }
                        >
                            <input
                                type="radio"
                                name="budgetType"
                                value="flexible"
                                checked={
                                    form.budgetType ===
                                    "flexible"
                                }
                                onChange={handleChange}
                            />

                            <span>
                                <strong>
                                    I'm flexible
                                </strong>

                                <small>
                                    Worker can suggest a
                                    suitable price.
                                </small>
                            </span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="urgency">
                            How urgent is it?
                        </label>

                        <select
                            id="urgency"
                            name="urgency"
                            value={form.urgency}
                            onChange={handleChange}
                        >
                            <option value="normal">
                                Normal
                            </option>

                            <option value="urgent">
                                Urgent
                            </option>

                            <option value="emergency">
                                Emergency
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bookingType">
                            Booking
                        </label>

                        <select
                            id="bookingType"
                            name="bookingType"
                            value={form.bookingType}
                            onChange={handleChange}
                        >
                            <option value="instant">
                                Find a worker now
                            </option>

                            <option value="scheduled">
                                Schedule for later
                            </option>
                        </select>
                    </div>
                </section>

                <div className="form-submit-area">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate("/customer")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Finding a worker..."
                            : "Post Job →"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostJob;