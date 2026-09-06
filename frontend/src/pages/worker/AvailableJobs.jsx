import {
  BriefcaseBusiness,
  ChevronRight,
  MapPin,
  Power,
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
  useNavigate,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import workerJobService from "../../services/workerJobService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const TOKEN_STORAGE_KEY =
  "nexserve_token";

const AvailableJobs = () => {
  const navigate =
    useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [jobs, setJobs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [offline, setOffline] =
    useState(false);

  const [locationMissing, setLocationMissing] =
    useState(false);

  const [workerStatus, setWorkerStatus] =
    useState(null);

  const [onlineLoading, setOnlineLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const getToken = () => {
    return localStorage.getItem(
      TOKEN_STORAGE_KEY
    );
  };

  const getHeaders = () => {
    const token =
      getToken();

    return {
      "Content-Type":
        "application/json",

      ...(token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : {}),
    };
  };

  // ===================================================
  // WORKER STATUS
  // ===================================================

  const loadWorkerStatus =
    useCallback(async () => {
      try {
        const token =
          getToken();

        if (!token) {
          throw new Error(
            "Authentication required. Please login again."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/workers/profile`,
            {
              headers:
                getHeaders(),
            }
          );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load worker profile."
          );
        }

        const worker =
          data?.worker ||
          data?.user ||
          data?.data;

        if (!worker) {
          throw new Error(
            "Worker profile not found."
          );
        }

        const isAvailable =
          Boolean(
            worker.isAvailable
          );

        const latitude =
          worker.location
            ?.latitude;

        const longitude =
          worker.location
            ?.longitude;

        const validLocation =
          Number.isFinite(
            Number(latitude)
          ) &&
          Number.isFinite(
            Number(longitude)
          );

        setWorkerStatus({
          isAvailable,
          location:
            worker.location ||
            null,
          skills:
            Array.isArray(
              worker.skills
            )
              ? worker.skills
              : [],
          city:
            worker.city || "",
        });

        setOffline(
          !isAvailable
        );

        setLocationMissing(
          !validLocation
        );

        return worker;
      } catch (err) {
        console.error(
          "Worker status error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load worker status."
        );

        return null;
      }
    }, []);

  // ===================================================
  // LOAD JOBS
  // ===================================================

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
            await workerJobService.getAvailableJobs(
              {
                category:
                  category === "All"
                    ? ""
                    : category,
                limit: 50,
              }
            );

          setJobs(
            Array.isArray(data)
              ? data
              : []
          );

          setOffline(false);
          setLocationMissing(false);
        } catch (err) {
          console.error(
            "Available jobs error:",
            err
          );

          const message =
            err?.message || "";

          if (
            message.toLowerCase()
              .includes(
                "must be online"
              )
          ) {
            setOffline(true);
            setJobs([]);
            setError("");
          } else if (
            message
              .toLowerCase()
              .includes("location") ||
            message
              .toLowerCase()
              .includes("latitude") ||
            message
              .toLowerCase()
              .includes("longitude")
          ) {
            setLocationMissing(
              true
            );
            setJobs([]);
            setError("");
          } else {
            setError(
              message ||
                "Unable to load available jobs."
            );
          }
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [category]
    );

  // ===================================================
  // INITIAL
  // ===================================================

  useEffect(() => {
    const initialize =
      async () => {
        const worker =
          await loadWorkerStatus();

        if (
          worker?.isAvailable
        ) {
          await loadJobs();
        } else {
          setLoading(false);
        }
      };

    initialize();
  }, [
    loadWorkerStatus,
    loadJobs,
  ]);

  // ===================================================
  // CURRENT LOCATION
  // ===================================================

  const updateCurrentLocation =
    async () => {
      if (
        !navigator.geolocation
      ) {
        setError(
          "Geolocation is not supported by this browser."
        );
        return;
      }

      try {
        setLocationLoading(true);
        setError("");

        const position =
          await new Promise(
            (
              resolve,
              reject
            ) => {
              navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                  enableHighAccuracy:
                    true,
                  timeout: 15000,
                  maximumAge: 0,
                }
              );
            }
          );

        const latitude =
          Number(
            position.coords
              .latitude
          );

        const longitude =
          Number(
            position.coords
              .longitude
          );

        const response =
          await fetch(
            `${API_BASE_URL}/workers/location`,
            {
              method:
                "PATCH",
              headers:
                getHeaders(),
              body: JSON.stringify(
                {
                  latitude,
                  longitude,
                }
              ),
            }
          );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to save current location."
          );
        }

        setLocationMissing(
          false
        );

        await loadWorkerStatus();

        if (
          workerStatus?.isAvailable
        ) {
          await loadJobs(
            true
          );
        }
      } catch (err) {
        console.error(
          "Location update error:",
          err
        );

        setError(
          err?.message ||
            "Unable to update location."
        );
      } finally {
        setLocationLoading(
          false
        );
      }
    };

  // ===================================================
  // GO ONLINE
  // ===================================================

  const goOnline =
    async () => {
      try {
        setOnlineLoading(true);
        setError("");

        let validLocation =
          !locationMissing;

        if (!validLocation) {
          await updateCurrentLocation();

          const worker =
            await loadWorkerStatus();

          validLocation =
            Boolean(
              worker?.location
                ?.latitude != null &&
                worker?.location
                  ?.longitude !=
                  null
            );
        }

        if (!validLocation) {
          throw new Error(
            "Please update your GPS location before going online."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/workers/availability`,
            {
              method:
                "PATCH",
              headers:
                getHeaders(),
              body: JSON.stringify(
                {
                  isAvailable:
                    true,
                }
              ),
            }
          );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to go online."
          );
        }

        setOffline(false);

        await loadWorkerStatus();

        await loadJobs(true);
      } catch (err) {
        console.error(
          "Go online error:",
          err
        );

        setError(
          err?.message ||
            "Unable to go online."
        );
      } finally {
        setOnlineLoading(
          false
        );
      }
    };

  // ===================================================
  // GO OFFLINE
  // ===================================================

  const goOffline =
    async () => {
      try {
        setOnlineLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/workers/availability`,
            {
              method:
                "PATCH",
              headers:
                getHeaders(),
              body: JSON.stringify(
                {
                  isAvailable:
                    false,
                }
              ),
            }
          );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to go offline."
          );
        }

        setOffline(true);
        setJobs([]);

        await loadWorkerStatus();
      } catch (err) {
        console.error(
          "Go offline error:",
          err
        );

        setError(
          err?.message ||
            "Unable to go offline."
        );
      } finally {
        setOnlineLoading(
          false
        );
      }
    };

  // ===================================================
  // FILTER
  // ===================================================

  const filteredJobs =
    useMemo(() => {
      const text =
        search
          .toLowerCase()
          .trim();

      return jobs.filter(
        (job) => {
          if (!text) {
            return true;
          }

          return (
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
        }
      );
    }, [jobs, search]);

  const categories =
    useMemo(() => {
      return [
        "All",
        ...Array.from(
          new Set(
            jobs
              .map(
                (job) =>
                  job.category
              )
              .filter(Boolean)
          )
        ),
      ];
    }, [jobs]);

  // ===================================================
  // RENDER
  // ===================================================

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
                WORKER MARKETPLACE
              </span>

              <h1>
                Available Jobs
              </h1>

              <p>
                Nearby matching service
                requests appear here.
              </p>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={
                offline
                  ? goOnline
                  : goOffline
              }
              disabled={
                onlineLoading ||
                locationLoading
              }
            >
              <Power size={17} />

              {onlineLoading
                ? "Updating..."
                : offline
                  ? "Go Online"
                  : "Go Offline"}
            </button>
          </section>

          {/* STATUS */}

          <section className="details-card">
            <div className="details-card-header">
              <div>
                <h2>
                  Worker Status
                </h2>

                <p>
                  {offline
                    ? "You are currently offline."
                    : "You are online and receiving nearby jobs."}
                </p>
              </div>

              {!offline &&
                !locationMissing && (
                  <span className="available-dot">
                    Online
                  </span>
                )}
            </div>

            {locationMissing && (
              <div className="dashboard-error">
                <span>
                  GPS location is required
                  to receive nearby jobs.
                </span>

                <button
                  type="button"
                  onClick={
                    updateCurrentLocation
                  }
                  disabled={
                    locationLoading
                  }
                >
                  {locationLoading
                    ? "Updating..."
                    : "Update Location"}
                </button>
              </div>
            )}
          </section>

          {error && (
            <div className="dashboard-error">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  loadJobs(true)
                }
              >
                Retry
              </button>
            </div>
          )}

          {/* FILTER */}

          <section className="jobs-toolbar">
            <div className="jobs-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? "All Services"
                      : item}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                loadJobs(true)
              }
              disabled={
                refreshing ||
                offline
              }
            >
              <RefreshCw
                size={16}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </section>

          {/* JOBS */}

          {loading ? (
            <div className="jobs-page-empty">
              <div className="dashboard-loading-spinner" />

              <h3>
                Finding nearby jobs...
              </h3>

              <p>
                Checking jobs matching
                your skills and location.
              </p>
            </div>
          ) : offline ? (
            <div className="jobs-page-empty">
              <div className="empty-job-icon">
                <Power size={26} />
              </div>

              <h3>
                You are Offline
              </h3>

              <p>
                Go online to receive
                nearby job requests.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={
                  goOnline
                }
                disabled={
                  onlineLoading
                }
              >
                <Power size={17} />
                Go Online
              </button>
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
                No matching jobs right now
              </h3>

              <p>
                Your backend is checking
                skill, city and GPS
                distance.
              </p>

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  loadJobs(true)
                }
              >
                <RefreshCw
                  size={16}
                />
                Check Again
              </button>
            </div>
          ) : (
            <section className="my-jobs-list">
              {filteredJobs.map(
                (job) => (
                  <article
                    key={
                      job.id
                    }
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

                          <span className="available-dot">
                            {job.distance !=
                            null
                              ? `${job.distance} km`
                              : "Nearby"}
                          </span>
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

                          <span>
                            Skill:{" "}
                            {job.requiredSkill ||
                              job.category}
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

          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              opacity: 0.65,
            }}
          >
            {filteredJobs.length} matching
            job(s) found
          </div>
        </main>
      </div>
    </div>
  );
};

export default AvailableJobs;