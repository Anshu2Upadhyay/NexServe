import { useState } from "react";

import { getCurrentUser } from "../services/authServices";

export default function WorkerProfile() {
    const worker = getCurrentUser();

    const [availability, setAvailability] = useState(
        worker?.isAvailable ?? true
    );

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        WORKER ACCOUNT
                    </span>

                    <h1>My Profile</h1>

                    <p>
                        Your NexServe worker information.
                    </p>
                </div>
            </div>

            <div
                className="detail-card"
                style={{
                    maxWidth: "800px"
                }}
            >

                <div className="worker-profile">

                    <div className="worker-avatar">
                        {(worker?.name || "W")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h3>
                            {worker?.name || "Worker"}
                        </h3>

                        <p>
                            {worker?.email || "—"}
                        </p>
                    </div>

                </div>


                <div
                    className="detail-grid"
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <div className="detail-item">
                        <span>Name</span>
                        <strong>
                            {worker?.name || "—"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Phone</span>
                        <strong>
                            {worker?.phone || "—"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Email</span>
                        <strong>
                            {worker?.email || "—"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>City</span>
                        <strong>
                            {worker?.city || "—"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Area</span>
                        <strong>
                            {worker?.area || "—"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Experience</span>
                        <strong>
                            {worker?.experience || 0} years
                        </strong>
                    </div>

                </div>


                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <div className="worker-availability">

                        <div className="availability-info">

                            <strong>

                                <span
                                    className={
                                        availability
                                            ? "online-dot"
                                            : "offline-dot"
                                    }
                                />

                                {availability
                                    ? "Available for Jobs"
                                    : "Currently Unavailable"}

                            </strong>

                            <span>
                                {availability
                                    ? "You can receive new service requests."
                                    : "New requests are paused."}
                            </span>

                        </div>


                        <label className="toggle">

                            <input
                                type="checkbox"
                                checked={availability}
                                onChange={(e) => {
                                    setAvailability(
                                        e.target.checked
                                    );
                                }}
                            />

                            <span className="toggle-slider" />

                        </label>

                    </div>

                </div>


                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <h3
                        style={{
                            marginBottom: "12px"
                        }}
                    >
                        Skills
                    </h3>


                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px"
                        }}
                    >

                        {(worker?.skills || []).length > 0 ? (

                            worker.skills.map(
                                (skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="status-badge status-posted"
                                    >
                                        {skill}
                                    </span>
                                )
                            )

                        ) : (

                            <span
                                style={{
                                    color: "#737e91",
                                    fontSize: "13px"
                                }}
                            >
                                No skills added.
                            </span>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}