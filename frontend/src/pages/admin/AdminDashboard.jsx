import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Users,
  UserRoundCheck,
  UserRoundCog,
} from "lucide-react";
import { useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Total Users",
      value: "2,486",
      change: "+12.8%",
      icon: Users,
      type: "blue",
    },
    {
      title: "Active Workers",
      value: "684",
      change: "+8.4%",
      icon: UserRoundCheck,
      type: "green",
    },
    {
      title: "Total Jobs",
      value: "5,842",
      change: "+16.2%",
      icon: BriefcaseBusiness,
      type: "orange",
    },
    {
      title: "Platform Revenue",
      value: "₹8.42L",
      change: "+21.5%",
      icon: IndianRupee,
      type: "purple",
    },
  ];

  const recentJobs = [
    {
      id: "JOB1048",
      title: "Bathroom Pipe Repair",
      customer: "Rahul Verma",
      worker: "Amit Sharma",
      amount: 450,
      status: "Completed",
    },
    {
      id: "JOB1047",
      title: "AC Service",
      customer: "Priya Singh",
      worker: "Ravi Kumar",
      amount: 700,
      status: "In Progress",
    },
    {
      id: "JOB1046",
      title: "Kitchen Tap Replacement",
      customer: "Mohit Gupta",
      worker: "Suresh Yadav",
      amount: 350,
      status: "Pending",
    },
    {
      id: "JOB1045",
      title: "Electrical Wiring",
      customer: "Ankit Mishra",
      worker: "Vikas Singh",
      amount: 1200,
      status: "Completed",
    },
  ];

  const activities = [
    {
      icon: UserRoundCheck,
      text: "New worker registered",
      name: "Sanjay Kumar",
      time: "5 min ago",
    },
    {
      icon: BriefcaseBusiness,
      text: "New job posted",
      name: "Kitchen Sink Repair",
      time: "18 min ago",
    },
    {
      icon: CheckCircle2,
      text: "Job completed",
      name: "Bathroom Pipe Repair",
      time: "32 min ago",
    },
    {
      icon: UserRoundCog,
      text: "Worker verification requested",
      name: "Deepak Singh",
      time: "1 hour ago",
    },
  ];

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

              <h1>Dashboard</h1>

              <p>
                Monitor NexServe activity, users and
                platform performance.
              </p>
            </div>

            <div className="admin-live-status">
              <span />
              System Operational
            </div>
          </section>

          <section className="admin-stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  className="admin-stat-card"
                  key={stat.title}
                >
                  <div
                    className={`admin-stat-icon ${stat.type}`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="admin-stat-content">
                    <span>{stat.title}</span>

                    <strong>{stat.value}</strong>

                    <small>
                      <ArrowUpRight size={11} />
                      {stat.change} this month
                    </small>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="admin-main-grid">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Recent Jobs</h2>

                  <p>
                    Latest activity across the platform.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-view-btn"
                >
                  View All
                </button>
              </div>

              <div className="admin-jobs-table">
                <div className="admin-table-head">
                  <span>JOB</span>
                  <span>CUSTOMER</span>
                  <span>WORKER</span>
                  <span>AMOUNT</span>
                  <span>STATUS</span>
                </div>

                {recentJobs.map((job) => (
                  <div
                    className="admin-table-row"
                    key={job.id}
                  >
                    <div className="admin-job-cell">
                      <div className="admin-job-icon">
                        <BriefcaseBusiness size={15} />
                      </div>

                      <div>
                        <strong>{job.title}</strong>
                        <span>{job.id}</span>
                      </div>
                    </div>

                    <span>{job.customer}</span>

                    <span>{job.worker}</span>

                    <strong>
                      ₹{job.amount.toLocaleString()}
                    </strong>

                    <span
                      className={`admin-job-status ${job.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel activity-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Live Activity</h2>

                  <p>Recent platform events.</p>
                </div>

                <Activity size={17} />
              </div>

              <div className="admin-activity-list">
                {activities.map((activity, index) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      className="admin-activity-item"
                      key={`${activity.name}-${index}`}
                    >
                      <div className="activity-icon">
                        <Icon size={15} />
                      </div>

                      <div>
                        <strong>
                          {activity.text}
                        </strong>

                        <span>
                          {activity.name}
                        </span>

                        <small>
                          {activity.time}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="admin-overview-grid">
            <div className="admin-overview-card">
              <div className="overview-card-icon">
                <Clock3 size={19} />
              </div>

              <div>
                <span>Pending Jobs</span>
                <strong>47</strong>
                <small>Needs attention</small>
              </div>
            </div>

            <div className="admin-overview-card">
              <div className="overview-card-icon">
                <UserRoundCog size={19} />
              </div>

              <div>
                <span>Worker Verifications</span>
                <strong>18</strong>
                <small>Awaiting approval</small>
              </div>
            </div>

            <div className="admin-overview-card">
              <div className="overview-card-icon">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <span>Completed Today</span>
                <strong>126</strong>
                <small>Jobs completed</small>
              </div>
            </div>

            <div className="admin-overview-card">
              <div className="overview-card-icon">
                <IndianRupee size={19} />
              </div>

              <div>
                <span>Today's Revenue</span>
                <strong>₹42,850</strong>
                <small>Platform earnings</small>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;