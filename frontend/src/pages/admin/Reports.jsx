import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("This Month");

  const reportData = {
    "This Week": {
      revenue: 18450,
      jobs: 42,
      completed: 34,
      customers: 31,
      workers: 18,
      growth: 8.4,
      chart: [2200, 3100, 2500, 3800, 2900, 3950, 0],
    },

    "This Month": {
      revenue: 78450,
      jobs: 186,
      completed: 149,
      customers: 118,
      workers: 54,
      growth: 14.8,
      chart: [9200, 11400, 9800, 13200, 11800, 14500, 8550],
    },

    "Last Month": {
      revenue: 68300,
      jobs: 164,
      completed: 131,
      customers: 104,
      workers: 49,
      growth: 9.6,
      chart: [7600, 10200, 9400, 11100, 10800, 12100, 7100],
    },
  };

  const current = reportData[period];

  const completionRate = useMemo(() => {
    if (!current.jobs) return 0;

    return Math.round(
      (current.completed / current.jobs) * 100
    );
  }, [current]);

  const maxRevenue = Math.max(...current.chart);

  const services = [
    {
      name: "Plumbing",
      jobs: 58,
      revenue: 24800,
      percentage: 32,
    },
    {
      name: "Electrical",
      jobs: 46,
      revenue: 21600,
      percentage: 28,
    },
    {
      name: "AC Repair",
      jobs: 34,
      revenue: 17200,
      percentage: 22,
    },
    {
      name: "Carpentry",
      jobs: 27,
      revenue: 9800,
      percentage: 13,
    },
    {
      name: "Other",
      jobs: 21,
      revenue: 5050,
      percentage: 5,
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

              <h1>Reports & Revenue</h1>

              <p>
                Track platform performance, jobs,
                customers, workers and revenue.
              </p>
            </div>

            <div className="reports-period-selector">
              {[
                "This Week",
                "This Month",
                "Last Month",
              ].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={
                    period === item ? "active" : ""
                  }
                  onClick={() => setPeriod(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="reports-summary-grid">
            <div className="reports-summary-card">
              <div className="reports-summary-icon revenue">
                <IndianRupee size={18} />
              </div>

              <div>
                <span>Total Revenue</span>

                <strong>
                  ₹{current.revenue.toLocaleString()}
                </strong>

                <small className="positive">
                  <ArrowUpRight size={11} />
                  {current.growth}% vs previous period
                </small>
              </div>
            </div>

            <div className="reports-summary-card">
              <div className="reports-summary-icon jobs">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <span>Total Jobs</span>

                <strong>{current.jobs}</strong>

                <small>
                  Jobs created during period
                </small>
              </div>
            </div>

            <div className="reports-summary-card">
              <div className="reports-summary-icon completed">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <span>Completed Jobs</span>

                <strong>{current.completed}</strong>

                <small>
                  {completionRate}% completion rate
                </small>
              </div>
            </div>

            <div className="reports-summary-card">
              <div className="reports-summary-icon users">
                <Users size={18} />
              </div>

              <div>
                <span>Active Customers</span>

                <strong>{current.customers}</strong>

                <small>
                  Customers using platform
                </small>
              </div>
            </div>
          </section>

          <section className="reports-main-grid">
            <div className="reports-chart-card">
              <div className="reports-card-header">
                <div>
                  <span className="reports-card-eyebrow">
                    REVENUE ANALYTICS
                  </span>

                  <h2>Revenue Overview</h2>
                </div>

                <div className="reports-chart-total">
                  <TrendingUp size={14} />

                  <span>
                    ₹{current.revenue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="reports-chart">
                <div className="reports-y-axis">
                  <span>₹15k</span>
                  <span>₹10k</span>
                  <span>₹5k</span>
                  <span>₹0</span>
                </div>

                <div className="reports-bars">
                  {current.chart.map((value, index) => {
                    const height =
                      maxRevenue > 0
                        ? (value / maxRevenue) * 100
                        : 0;

                    const labels = [
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                      "Sun",
                    ];

                    return (
                      <div
                        className="reports-bar-column"
                        key={labels[index]}
                      >
                        <div className="reports-bar-value">
                          {value > 0
                            ? `₹${(
                                value / 1000
                              ).toFixed(1)}k`
                            : ""}
                        </div>

                        <div className="reports-bar-area">
                          <div
                            className="reports-bar"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        </div>

                        <span>{labels[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="reports-performance-card">
              <div className="reports-card-header">
                <div>
                  <span className="reports-card-eyebrow">
                    PLATFORM HEALTH
                  </span>

                  <h2>Performance</h2>
                </div>

                <BarChart3 size={16} />
              </div>

              <div className="reports-performance-item">
                <div className="performance-label">
                  <span>Job Completion</span>
                  <strong>{completionRate}%</strong>
                </div>

                <div className="performance-track">
                  <div
                    className="performance-fill"
                    style={{
                      width: `${completionRate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="reports-performance-item">
                <div className="performance-label">
                  <span>Worker Utilization</span>
                  <strong>78%</strong>
                </div>

                <div className="performance-track">
                  <div
                    className="performance-fill"
                    style={{
                      width: "78%",
                    }}
                  />
                </div>
              </div>

              <div className="reports-performance-item">
                <div className="performance-label">
                  <span>Customer Retention</span>
                  <strong>71%</strong>
                </div>

                <div className="performance-track">
                  <div
                    className="performance-fill"
                    style={{
                      width: "71%",
                    }}
                  />
                </div>
              </div>

              <div className="reports-performance-item">
                <div className="performance-label">
                  <span>Worker Availability</span>
                  <strong>84%</strong>
                </div>

                <div className="performance-track">
                  <div
                    className="performance-fill"
                    style={{
                      width: "84%",
                    }}
                  />
                </div>
              </div>

              <div className="reports-worker-count">
                <div className="reports-worker-count-icon">
                  <Users size={15} />
                </div>

                <div>
                  <span>Verified Workers</span>
                  <strong>{current.workers}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="reports-bottom-grid">
            <div className="reports-services-card">
              <div className="reports-card-header">
                <div>
                  <span className="reports-card-eyebrow">
                    SERVICE BREAKDOWN
                  </span>

                  <h2>Top Services</h2>
                </div>

                <BriefcaseBusiness size={16} />
              </div>

              <div className="reports-service-list">
                {services.map((service) => (
                  <div
                    className="reports-service-row"
                    key={service.name}
                  >
                    <div className="reports-service-name">
                      <div className="service-dot" />

                      <div>
                        <strong>{service.name}</strong>

                        <span>
                          {service.jobs} jobs
                        </span>
                      </div>
                    </div>

                    <div className="reports-service-progress">
                      <div className="service-progress-track">
                        <div
                          className="service-progress-fill"
                          style={{
                            width: `${service.percentage}%`,
                          }}
                        />
                      </div>

                      <span>
                        {service.percentage}%
                      </span>
                    </div>

                    <strong className="reports-service-revenue">
                      ₹{service.revenue.toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="reports-insights-card">
              <div className="reports-card-header">
                <div>
                  <span className="reports-card-eyebrow">
                    QUICK INSIGHTS
                  </span>

                  <h2>Platform Summary</h2>
                </div>
              </div>

              <div className="reports-insight">
                <div className="insight-icon success">
                  <ArrowUpRight size={15} />
                </div>

                <div>
                  <strong>Revenue is growing</strong>

                  <span>
                    Revenue increased by{" "}
                    {current.growth}% compared with
                    the previous period.
                  </span>
                </div>
              </div>

              <div className="reports-insight">
                <div className="insight-icon warning">
                  <Clock3 size={15} />
                </div>

                <div>
                  <strong>Pending jobs need attention</strong>

                  <span>
                    Review unassigned jobs and connect
                    them with nearby workers.
                  </span>
                </div>
              </div>

              <div className="reports-insight">
                <div className="insight-icon primary">
                  <Users size={15} />
                </div>

                <div>
                  <strong>
                    Worker network is expanding
                  </strong>

                  <span>
                    {current.workers} verified workers
                    are currently available in the
                    platform network.
                  </span>
                </div>
              </div>

              <div className="reports-insight">
                <div className="insight-icon danger">
                  <ArrowDownRight size={15} />
                </div>

                <div>
                  <strong>Monitor cancellations</strong>

                  <span>
                    Keep track of cancelled jobs to
                    improve customer satisfaction.
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="reports-demo-note">
            <BarChart3 size={13} />

            Reports are currently powered by frontend
            mock data. Backend analytics can be connected
            later.
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;