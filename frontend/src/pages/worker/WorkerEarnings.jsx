import {
    ArrowDownToLine,
    BriefcaseBusiness,
    CalendarDays,
    IndianRupee,
    TrendingUp,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const WorkerEarnings = () => {
    const {
        token,
    } = useAuth();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [jobs, setJobs] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD EARNINGS
    // =====================================================

    const loadEarnings = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                if (!token) {
                    throw new Error(
                        "Authentication required. Please login again."
                    );
                }

                const response =
                    await fetch(
                        `${API_BASE_URL}/workers/earnings`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type":
                                    "application/json",
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response
                        .json()
                        .catch(
                            () => ({})
                        );

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                            "Unable to load earnings."
                    );
                }

                const earnings =
                    data?.earnings || {};

                setTotal(
                    Number(
                        earnings.total ||
                            earnings.totalEarnings ||
                            0
                    )
                );

                setJobs(
                    Array.isArray(
                        earnings.jobs
                    )
                        ? earnings.jobs
                        : []
                );
            } catch (err) {
                console.error(
                    "Worker earnings error:",
                    err
                );

                setError(
                    err?.message ||
                        "Unable to load earnings."
                );
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadEarnings();
    }, [loadEarnings]);

    // =====================================================
    // COMPLETED JOBS
    // =====================================================

    const completed = useMemo(() => {
        return jobs;
    }, [jobs]);

    // =====================================================
    // AVERAGE
    // =====================================================

    const average = useMemo(() => {
        if (!completed.length) {
            return 0;
        }

        return Math.round(
            total / completed.length
        );
    }, [
        total,
        completed.length,
    ]);

    // =====================================================
    // DATE HELPER
    // =====================================================

    const formatDate = (
        dateValue
    ) => {
        if (!dateValue) {
            return "Recently";
        }

        const date =
            new Date(dateValue);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Recently";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // JOB AMOUNT
    // =====================================================

    const getJobAmount = (
        job
    ) => {
        return Number(
            job?.finalPrice ||
                job?.earning ||
                job?.amount ||
                0
        );
    };

    // =====================================================
    // EXPORT CSV
    // =====================================================

    const handleExport = () => {
        if (!completed.length) {
            return;
        }

        const headers = [
            "Job",
            "Category",
            "Date",
            "Status",
            "Amount",
            "Payment Status",
            "Transaction ID",
        ];

        const rows =
            completed.map(
                (job) => [
                    job.title ||
                        "Untitled Job",

                    job.category ||
                        "",

                    formatDate(
                        job.paidAt ||
                            job.updatedAt ||
                            job.completedAt
                    ),

                    "Completed",

                    getJobAmount(
                        job
                    ),

                    job.paymentStatus ||
                        "paid",

                    job.transactionId ||
                        "",
                ]
            );

        const csv = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map(
                        (
                            value
                        ) => {
                            const text =
                                String(
                                    value ??
                                        ""
                                );

                            return `"${text.replace(
                                /"/g,
                                '""'
                            )}"`;
                        }
                    )
                    .join(",")
            )
            .join("\n");

        const blob =
            new Blob(
                [csv],
                {
                    type: "text/csv;charset=utf-8;",
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            `nexserve-earnings-${new Date()
                .toISOString()
                .slice(
                    0,
                    10
                )}.csv`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="app-layout">

            <Sidebar
                isOpen={
                    sidebarOpen
                }
                onClose={() =>
                    setSidebarOpen(
                        false
                    )
                }
            />

            <div className="main-area">

                <Navbar
                    onMenuClick={() =>
                        setSidebarOpen(
                            true
                        )
                    }
                />

                <main className="dashboard-content">

                    {/* HEADER */}

                    <section className="page-heading-row">

                        <div>

                            <span className="page-eyebrow">
                                WORKER FINANCE
                            </span>

                            <h1>
                                Earnings
                            </h1>

                            <p>
                                Review your completed jobs and
                                earnings summary.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={
                                handleExport
                            }
                            disabled={
                                loading ||
                                completed.length ===
                                    0
                            }
                        >
                            <ArrowDownToLine
                                size={15}
                            />

                            Export
                        </button>

                    </section>

                    {/* ERROR */}

                    {error && (
                        <div className="my-jobs-error">

                            <span>
                                {error}
                            </span>

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={
                                    loadEarnings
                                }
                            >
                                Retry
                            </button>

                        </div>
                    )}

                    {/* STATS */}

                    <section className="worker-stats-grid">

                        <div className="worker-stat-card">

                            <div className="worker-stat-icon earnings">

                                <IndianRupee
                                    size={20}
                                />

                            </div>

                            <div>

                                <span>
                                    Total Earnings
                                </span>

                                <strong>
                                    {loading
                                        ? "—"
                                        : `₹${total.toLocaleString(
                                              "en-IN"
                                          )}`}
                                </strong>

                            </div>

                        </div>

                        <div className="worker-stat-card">

                            <div className="worker-stat-icon completed">

                                <BriefcaseBusiness
                                    size={20}
                                />

                            </div>

                            <div>

                                <span>
                                    Completed Jobs
                                </span>

                                <strong>
                                    {loading
                                        ? "—"
                                        : completed.length}
                                </strong>

                            </div>

                        </div>

                        <div className="worker-stat-card">

                            <div className="worker-stat-icon">

                                <TrendingUp
                                    size={20}
                                />

                            </div>

                            <div>

                                <span>
                                    Average / Job
                                </span>

                                <strong>
                                    {loading
                                        ? "—"
                                        : `₹${average.toLocaleString(
                                              "en-IN"
                                          )}`}
                                </strong>

                            </div>

                        </div>

                    </section>

                    {/* COMPLETED JOBS */}

                    <section className="admin-panel">

                        <div className="admin-panel-header">

                            <div>

                                <h2>
                                    Completed Jobs
                                </h2>

                                <p>
                                    Your completed and paid job
                                    earnings history.
                                </p>

                            </div>

                            <CalendarDays
                                size={18}
                            />

                        </div>

                        {loading ? (

                            <div className="jobs-page-empty">

                                <div className="dashboard-loading-spinner" />

                                <h3>
                                    Loading earnings...
                                </h3>

                            </div>

                        ) : completed.length ===
                          0 ? (

                            <div className="jobs-page-empty">

                                <BriefcaseBusiness
                                    size={28}
                                />

                                <h3>
                                    No completed jobs yet
                                </h3>

                                <p>
                                    Complete and receive payment
                                    for a job to see earnings here.
                                </p>

                            </div>

                        ) : (

                            <div className="admin-jobs-table">

                                <div className="admin-table-head">

                                    <span>
                                        JOB
                                    </span>

                                    <span>
                                        DATE
                                    </span>

                                    <span>
                                        STATUS
                                    </span>

                                    <span>
                                        AMOUNT
                                    </span>

                                </div>

                                {completed.map(
                                    (job) => {
                                        const amount =
                                            getJobAmount(
                                                job
                                            );

                                        return (
                                            <div
                                                className="admin-table-row"
                                                key={
                                                    job._id ||
                                                    job.id ||
                                                    job.transactionId
                                                }
                                            >

                                                <div className="admin-job-cell">

                                                    <div className="admin-job-icon">

                                                        <BriefcaseBusiness
                                                            size={
                                                                15
                                                            }
                                                        />

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {job.title ||
                                                                "Untitled Job"}
                                                        </strong>

                                                        <span>
                                                            {job.transactionId ||
                                                                job._id ||
                                                                job.id ||
                                                                "—"}
                                                        </span>

                                                    </div>

                                                </div>

                                                <span>
                                                    {formatDate(
                                                        job.paidAt ||
                                                            job.updatedAt ||
                                                            job.completedAt
                                                    )}
                                                </span>

                                                <span className="admin-job-status completed">
                                                    Completed
                                                </span>

                                                <strong>
                                                    ₹
                                                    {amount.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>

                </main>
            </div>
        </div>
    );
};

export default WorkerEarnings;