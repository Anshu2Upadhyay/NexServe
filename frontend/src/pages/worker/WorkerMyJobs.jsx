import {
  BriefcaseBusiness,
  ChevronRight,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import StatusBadge from "../../components/jobs/StatusBadge";
import workerJobService from "../../services/workerJobService";

const WorkerMyJobs = () => {
  const navigate =
    useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const loadJobs =
    useCallback(
      async (
        isRefresh = false
      ) => {
        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError("");

          const data =
            await workerJobService.getMyJobs();

          setJobs(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (err) {
          console.error(
            "Worker My Jobs error:",
            err
          );

          setError(
            err?.message ||
              "Unable to load your jobs."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs =
    useMemo(() => {
      const text =
        search
          .toLowerCase()
          .trim();

      if (!text) {
        return jobs;
      }

      return jobs.filter(
        (job) =>
          job.title
            ?.toLowerCase()
            .includes(text) ||
          job.category
            ?.toLowerCase()
            .includes(text) ||
          job.description
            ?.toLowerCase()
            .includes(text) ||
          job.location
            ?.toLowerCase()
            .includes(text)
      );
    }, [jobs, search]);

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
          <section className="page-heading-row">
            <div>
              <span className="page-eyebrow">
                WORK ASSIGNMENTS
              </span>

              <h1>
                My Jobs
              </h1>

              <p>
                Jobs accepted by you
                appear here.
              </p>
            </div>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                loadJobs(true)
              }
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </section>

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          <section className="jobs-toolbar">
            <div className="jobs-search">
              <Search size={17} />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search accepted jobs..."
              />
            </div>
          </section>

          {loading ? (
            <div className="jobs-page-empty">
              <div className="dashboard-loading-spinner" />

              <h3>
                Loading your jobs...
              </h3>
            </div>
          ) : filteredJobs.length ===
            0 ? (
            <div className="jobs-page-empty">
              <div className="empty-job-icon">
                <BriefcaseBusiness
                  size={27}
                />
              </div>

              <h3>
                No accepted jobs yet
              </h3>

              <p>
                Accept a nearby job
                and it will appear
                here.
              </p>

              <Link
                to="/worker/available-jobs"
                className="primary-btn"
              >
                <BriefcaseBusiness
                  size={17}
                />
                Find Available Jobs
              </Link>
            </div>
          ) : (
            <section className="my-jobs-list">
              {filteredJobs.map(
                (job) => (
                  <article
                    key={job.id}
                    className="my-job-card"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      navigate(
                        `/worker/jobs/${job.id}`
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        event.preventDefault();

                        navigate(
                          `/worker/jobs/${job.id}`
                        );
                      }
                    }}
                  >
                    <div className="my-job-main">
                      <div className="my-job-icon">
                        <BriefcaseBusiness
                          size={21}
                        />
                      </div>

                      <div className="my-job-content">
                        <div className="my-job-title-row">
                          <div>
                            <span className="job-category">
                              {job.category}
                            </span>

                            <h2>
                              {job.title}
                            </h2>
                          </div>

                          <StatusBadge
                            status={
                              job.status
                            }
                          />
                        </div>

                        <p className="my-job-description">
                          {job.description}
                        </p>

                        <div className="my-job-meta">
                          <span>
                            <MapPin
                              size={15}
                            />

                            {job.location}
                          </span>

                          <span>
                            ₹
                            {job.budget
                              ?.min ??
                              0}
                            {" - ₹"}
                            {job.budget
                              ?.max ??
                              0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="my-job-arrow">
                      <ChevronRight
                        size={20}
                      />
                    </div>
                  </article>
                )
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default WorkerMyJobs;