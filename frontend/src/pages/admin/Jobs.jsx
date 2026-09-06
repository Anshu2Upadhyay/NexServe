import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Search,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

const Jobs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [jobs, setJobs] = useState([
    {
      id: "JOB1048",
      title: "Bathroom Pipe Repair",
      customer: "Rahul Verma",
      worker: "Amit Sharma",
      category: "Plumbing",
      location: "Pipraich, Gorakhpur",
      amount: 450,
      status: "Completed",
      date: "03 Sep 2026",
    },
    {
      id: "JOB1047",
      title: "AC Service",
      customer: "Priya Singh",
      worker: "Ravi Kumar",
      category: "AC Repair",
      location: "Gorakhpur",
      amount: 700,
      status: "In Progress",
      date: "03 Sep 2026",
    },
    {
      id: "JOB1046",
      title: "Kitchen Tap Replacement",
      customer: "Mohit Gupta",
      worker: "Not Assigned",
      category: "Plumbing",
      location: "Pipraich",
      amount: 350,
      status: "Pending",
      date: "02 Sep 2026",
    },
    {
      id: "JOB1045",
      title: "Electrical Wiring",
      customer: "Ankit Mishra",
      worker: "Vikas Singh",
      category: "Electrical",
      location: "Gorakhpur",
      amount: 1200,
      status: "Completed",
      date: "02 Sep 2026",
    },
    {
      id: "JOB1044",
      title: "Ceiling Fan Installation",
      customer: "Neha Gupta",
      worker: "Suresh Yadav",
      category: "Electrical",
      location: "Gorakhpur",
      amount: 500,
      status: "Cancelled",
      date: "01 Sep 2026",
    },
    {
      id: "JOB1043",
      title: "Door Lock Repair",
      customer: "Aman Singh",
      worker: "Deepak Singh",
      category: "Locksmith",
      location: "Pipraich",
      amount: 300,
      status: "Completed",
      date: "01 Sep 2026",
    },
  ]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = search.toLowerCase();

      const matchesSearch =
        job.id.toLowerCase().includes(query) ||
        job.title.toLowerCase().includes(query) ||
        job.customer.toLowerCase().includes(query) ||
        job.worker.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || job.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filter]);

  const updateStatus = (id, status) => {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === id
          ? { ...job, status }
          : job
      )
    );
  };

  const totalJobs = jobs.length;

  const pendingJobs = jobs.filter(
    (job) => job.status === "Pending"
  ).length;

  const activeJobs = jobs.filter(
    (job) => job.status === "In Progress"
  ).length;

  const completedJobs = jobs.filter(
    (job) => job.status === "Completed"
  ).length;

  const totalRevenue = jobs
    .filter((job) => job.status === "Completed")
    .reduce((total, job) => total + job.amount, 0);

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="dashboard-content">
          <section className="page-heading-row">
            <div>
              <span className="page-eyebrow">
                ADMIN PANEL
              </span>

              <h1>Jobs Management</h1>

              <p>
                Monitor and manage all jobs posted on
                the platform.
              </p>
            </div>

            <div className="jobs-admin-live">
              <BriefcaseBusiness size={14} />
              {totalJobs} Total Jobs
            </div>
          </section>

          <section className="jobs-admin-summary">
            <div className="jobs-admin-summary-card">
              <div className="jobs-admin-summary-icon blue">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <span>Total Jobs</span>
                <strong>{totalJobs}</strong>
              </div>
            </div>

            <div className="jobs-admin-summary-card">
              <div className="jobs-admin-summary-icon orange">
                <Clock3 size={19} />
              </div>

              <div>
                <span>Pending</span>
                <strong>{pendingJobs}</strong>
              </div>
            </div>

            <div className="jobs-admin-summary-card">
              <div className="jobs-admin-summary-icon purple">
                <MapPin size={19} />
              </div>

              <div>
                <span>In Progress</span>
                <strong>{activeJobs}</strong>
              </div>
            </div>

            <div className="jobs-admin-summary-card">
              <div className="jobs-admin-summary-icon green">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <span>Completed</span>
                <strong>{completedJobs}</strong>
              </div>
            </div>

            <div className="jobs-admin-summary-card revenue">
              <div className="jobs-admin-summary-icon green">
                ₹
              </div>

              <div>
                <span>Completed Value</span>
                <strong>
                  ₹{totalRevenue.toLocaleString()}
                </strong>
              </div>
            </div>
          </section>

          <section className="jobs-admin-panel">
            <div className="jobs-admin-toolbar">
              <div className="jobs-admin-search">
                <Search size={15} />

                <input
                  type="text"
                  placeholder="Search job, customer, worker, category..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <div className="jobs-admin-filters">
                {[
                  "All",
                  "Pending",
                  "In Progress",
                  "Completed",
                  "Cancelled",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      filter === item ? "active" : ""
                    }
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="jobs-admin-table-wrapper">
              <div className="jobs-admin-table-head">
                <span>JOB</span>
                <span>CUSTOMER</span>
                <span>WORKER</span>
                <span>SERVICE</span>
                <span>LOCATION</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
                <span>ACTION</span>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="jobs-admin-empty">
                  <Search size={24} />

                  <strong>No jobs found</strong>

                  <span>
                    Try changing your search or status
                    filter.
                  </span>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    className="jobs-admin-table-row"
                    key={job.id}
                  >
                    <div className="admin-job-info">
                      <div className="admin-job-avatar">
                        <BriefcaseBusiness size={14} />
                      </div>

                      <div>
                        <strong>{job.title}</strong>
                        <span>{job.id}</span>
                        <small>{job.date}</small>
                      </div>
                    </div>

                    <span className="admin-job-person">
                      {job.customer}
                    </span>

                    <span
                      className={
                        job.worker === "Not Assigned"
                          ? "not-assigned"
                          : "admin-job-person"
                      }
                    >
                      {job.worker}
                    </span>

                    <span className="admin-job-category">
                      {job.category}
                    </span>

                    <span className="admin-job-location">
                      <MapPin size={10} />
                      {job.location}
                    </span>

                    <strong className="admin-job-amount">
                      ₹{job.amount.toLocaleString()}
                    </strong>

                    <span
                      className={`admin-job-status ${job.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {job.status === "Completed" && (
                        <CheckCircle2 size={10} />
                      )}

                      {job.status === "Pending" && (
                        <Clock3 size={10} />
                      )}

                      {job.status === "Cancelled" && (
                        <XCircle size={10} />
                      )}

                      {job.status === "In Progress" && (
                        <MapPin size={10} />
                      )}

                      {job.status}
                    </span>

                    <div className="admin-job-actions">
                      <button
                        type="button"
                        className="admin-job-view"
                        title="View Job"
                        onClick={() =>
                          alert(
                            `Job: ${job.title}\nID: ${job.id}\nCustomer: ${job.customer}\nWorker: ${job.worker}\nAmount: ₹${job.amount}`
                          )
                        }
                      >
                        <Eye size={13} />
                      </button>

                      {job.status === "Pending" && (
                        <button
                          type="button"
                          className="admin-job-complete"
                          onClick={() =>
                            updateStatus(
                              job.id,
                              "In Progress"
                            )
                          }
                        >
                          Start
                        </button>
                      )}

                      {job.status === "In Progress" && (
                        <button
                          type="button"
                          className="admin-job-complete"
                          onClick={() =>
                            updateStatus(
                              job.id,
                              "Completed"
                            )
                          }
                        >
                          Complete
                        </button>
                      )}

                      {job.status !== "Completed" &&
                        job.status !== "Cancelled" && (
                          <button
                            type="button"
                            className="admin-job-cancel"
                            onClick={() =>
                              updateStatus(
                                job.id,
                                "Cancelled"
                              )
                            }
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="jobs-admin-footer">
              <span>
                Showing {filteredJobs.length} of{" "}
                {jobs.length} jobs
              </span>

              <span>
                Job actions are currently using mock
                frontend data.
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Jobs;