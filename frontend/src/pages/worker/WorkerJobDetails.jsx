import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Phone,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import StatusBadge from "../../components/jobs/StatusBadge";
import workerJobService from "../../services/workerJobService";

const WorkerJobDetails = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [accepting, setAccepting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const loadJob =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await workerJobService.getJobById(
              id
            );

          if (mounted) {
            setJob(data);
          }
        } catch (err) {
          console.error(
            "Worker job details error:",
            err
          );

          if (mounted) {
            setError(
              err?.message ||
                "Unable to load job details."
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadJob();

    return () => {
      mounted = false;
    };
  }, [id]);

  // ===================================================
  // ACCEPT
  // ===================================================

  const handleAcceptJob =
    async () => {
      if (
        !job ||
        accepting
      ) {
        return;
      }

      try {
        setAccepting(true);
        setMessage("");
        setError("");

        const updated =
          await workerJobService.acceptJob(
            job.id
          );

        setJob(updated);

        setMessage(
          "Job accepted successfully."
        );
      } catch (err) {
        console.error(
          "Accept job error:",
          err
        );

        setError(
          err?.message ||
            "Unable to accept this job."
        );
      } finally {
        setAccepting(false);
      }
    };

  // ===================================================
  // LOCATION
  // ===================================================

  const getLocation = () => {
    if (
      typeof job?.location ===
      "string"
    ) {
      return job.location;
    }

    if (
      job?.location &&
      typeof job.location ===
        "object"
    ) {
      return (
        job.location.address ||
        job.location.area ||
        job.location.city ||
        "Location not specified"
      );
    }

    return [
      job?.area,
      job?.city,
    ]
      .filter(Boolean)
      .join(", ") ||
      "Location not specified";
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <div className="main-area">
          <Navbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="dashboard-content">
            <div className="jobs-page-empty">
              <div className="dashboard-loading-spinner" />

              <h3>
                Loading job details...
              </h3>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error && !job) {
    return (
      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <div className="main-area">
          <Navbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="dashboard-content">
            <div className="jobs-page-empty">
              <div className="empty-job-icon">
                <BriefcaseBusiness
                  size={27}
                />
              </div>

              <h3>
                Unable to load job
              </h3>

              <p>{error}</p>

              <Link
                to="/worker/available-jobs"
                className="primary-btn"
              >
                <ArrowLeft size={17} />
                Back to Available Jobs
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const status =
    String(
      job?.status || ""
    ).toLowerCase();

  const canAccept =
    !job?.assignedWorker &&
    [
      "posted",
      "searching",
    ].includes(status);

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="main-area">
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="dashboard-content">
          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          {message && (
            <div className="dashboard-success">
              {message}
            </div>
          )}

          <section className="job-details-header">
            <div>
              <span className="page-eyebrow">
                JOB REQUEST
              </span>

              <h1>
                {job?.title}
              </h1>

              <p>
                Job ID:{" "}
                <strong>
                  {job?.id}
                </strong>
              </p>
            </div>

            <StatusBadge
              status={
                job?.status ||
                "posted"
              }
            />
          </section>

          <div className="details-layout">
            <section className="details-main">
              <div className="details-card">
                <div className="details-card-header">
                  <h2>
                    Job Information
                  </h2>
                </div>

                <div className="details-description">
                  <span>
                    Description
                  </span>

                  <p>
                    {job?.description ||
                      "No description provided."}
                  </p>
                </div>

                <div className="details-info-grid">
                  <div className="detail-item">
                    <MapPin size={19} />

                    <div>
                      <span>
                        Location
                      </span>

                      <strong>
                        {getLocation()}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <IndianRupee
                      size={19}
                    />

                    <div>
                      <span>
                        Budget
                      </span>

                      <strong>
                        ₹
                        {job?.budget
                          ?.min ??
                          0}
                        {" - ₹"}
                        {job?.budget
                          ?.max ??
                          0}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <CheckCircle2
                      size={19}
                    />

                    <div>
                      <span>
                        Required Skill
                      </span>

                      <strong>
                        {job?.requiredSkill ||
                          job?.category}
                      </strong>
                    </div>
                  </div>

                  {job?.distance !=
                    null && (
                    <div className="detail-item">
                      <MapPin
                        size={19}
                      />

                      <div>
                        <span>
                          Distance
                        </span>

                        <strong>
                          {job.distance} km
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {job?.customer && (
                <div className="details-card">
                  <div className="details-card-header">
                    <h2>
                      Customer
                    </h2>
                  </div>

                  <div className="worker-detail">
                    <div className="worker-avatar">
                      {job.customer.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "C"}
                    </div>

                    <div className="worker-info">
                      <strong>
                        {
                          job
                            .customer
                            .name
                        }
                      </strong>

                      <span>
                        {job
                          .customer
                          .city ||
                          ""}
                      </span>
                    </div>

                    {job.customer
                      .phone && (
                      <a
                        href={`tel:${job.customer.phone}`}
                        className="call-btn"
                      >
                        <Phone
                          size={17}
                        />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </section>

            <aside className="details-side">
              <div className="details-card">
                <div className="details-card-header">
                  <h2>
                    Job Summary
                  </h2>
                </div>

                <div className="summary-list">
                  <div>
                    <span>
                      Category
                    </span>

                    <strong>
                      {job?.category}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Status
                    </span>

                    <strong>
                      {job?.status}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Distance
                    </span>

                    <strong>
                      {job?.distance !=
                      null
                        ? `${job.distance} km`
                        : "Nearby"}
                    </strong>
                  </div>
                </div>
              </div>

              {canAccept ? (
                <button
                  type="button"
                  className="accept-job-btn"
                  onClick={
                    handleAcceptJob
                  }
                  disabled={
                    accepting
                  }
                >
                  {accepting
                    ? "Accepting..."
                    : "Accept Job"}
                </button>
              ) : (
                <div className="details-card">
                  <div className="empty-state">
                    <CheckCircle2
                      size={28}
                    />

                    <h3>
                      {job?.assignedWorker
                        ? "Job Already Assigned"
                        : "Job Not Available"}
                    </h3>
                  </div>
                </div>
              )}

              <Link
                to="/worker/my-jobs"
                className="secondary-btn full-width"
              >
                <BriefcaseBusiness
                  size={17}
                />
                My Jobs
              </Link>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerJobDetails;