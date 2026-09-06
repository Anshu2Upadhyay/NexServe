import {
  Ban,
  CheckCircle2,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

const Users = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [users, setUsers] = useState([
    {
      id: "USR1001",
      name: "Rahul Verma",
      email: "rahul.verma@email.com",
      phone: "9876543210",
      role: "Customer",
      status: "Active",
      joined: "28 Aug 2026",
    },
    {
      id: "USR1002",
      name: "Amit Sharma",
      email: "amit.sharma@email.com",
      phone: "9876543213",
      role: "Worker",
      status: "Active",
      joined: "25 Aug 2026",
    },
    {
      id: "USR1003",
      name: "Priya Singh",
      email: "priya.singh@email.com",
      phone: "9876543218",
      role: "Customer",
      status: "Active",
      joined: "23 Aug 2026",
    },
    {
      id: "USR1004",
      name: "Ravi Kumar",
      email: "ravi.kumar@email.com",
      phone: "9876543221",
      role: "Worker",
      status: "Pending",
      joined: "21 Aug 2026",
    },
    {
      id: "USR1005",
      name: "Mohit Gupta",
      email: "mohit.gupta@email.com",
      phone: "9876543228",
      role: "Customer",
      status: "Blocked",
      joined: "19 Aug 2026",
    },
    {
      id: "USR1006",
      name: "Suresh Yadav",
      email: "suresh.yadav@email.com",
      phone: "9876543234",
      role: "Worker",
      status: "Active",
      joined: "17 Aug 2026",
    },
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.phone.includes(search) ||
        user.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        user.role === filter ||
        user.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const updateStatus = (id, status) => {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === id
          ? { ...user, status }
          : user
      )
    );
  };

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const workers = users.filter(
    (user) => user.role === "Worker"
  ).length;

  const customers = users.filter(
    (user) => user.role === "Customer"
  ).length;

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

              <h1>Users</h1>

              <p>
                Manage customers, workers and account
                access.
              </p>
            </div>
          </section>

          <section className="users-summary-grid">
            <div className="users-summary-card">
              <div className="users-summary-icon blue">
                <UserRound size={19} />
              </div>

              <div>
                <span>Total Users</span>
                <strong>{users.length}</strong>
              </div>
            </div>

            <div className="users-summary-card">
              <div className="users-summary-icon green">
                <UserRoundCheck size={19} />
              </div>

              <div>
                <span>Active Users</span>
                <strong>{activeUsers}</strong>
              </div>
            </div>

            <div className="users-summary-card">
              <div className="users-summary-icon orange">
                <ShieldCheck size={19} />
              </div>

              <div>
                <span>Workers</span>
                <strong>{workers}</strong>
              </div>
            </div>

            <div className="users-summary-card">
              <div className="users-summary-icon purple">
                <UserRound size={19} />
              </div>

              <div>
                <span>Customers</span>
                <strong>{customers}</strong>
              </div>
            </div>
          </section>

          <section className="users-panel">
            <div className="users-toolbar">
              <div className="user-search-box">
                <Search size={15} />

                <input
                  type="text"
                  placeholder="Search by name, email, phone or ID..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <div className="user-filters">
                {[
                  "All",
                  "Customer",
                  "Worker",
                  "Active",
                  "Pending",
                  "Blocked",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      filter === item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFilter(item)
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="users-table-wrapper">
              <div className="users-table-head">
                <span>USER</span>
                <span>CONTACT</span>
                <span>ROLE</span>
                <span>STATUS</span>
                <span>JOINED</span>
                <span>ACTION</span>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="users-empty">
                  <Search size={24} />
                  <strong>No users found</strong>
                  <span>
                    Try changing your search or filter.
                  </span>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    className="users-table-row"
                    key={user.id}
                  >
                    <div className="user-info-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.id}</span>
                      </div>
                    </div>

                    <div className="user-contact-cell">
                      <span>{user.email}</span>
                      <small>{user.phone}</small>
                    </div>

                    <span
                      className={`user-role ${user.role.toLowerCase()}`}
                    >
                      {user.role}
                    </span>

                    <span
                      className={`user-status ${user.status.toLowerCase()}`}
                    >
                      {user.status === "Active" && (
                        <CheckCircle2 size={11} />
                      )}

                      {user.status === "Blocked" && (
                        <Ban size={11} />
                      )}

                      {user.status}
                    </span>

                    <span className="user-joined">
                      {user.joined}
                    </span>

                    <div className="user-action-cell">
                      {user.status === "Blocked" ? (
                        <button
                          type="button"
                          className="user-action unblock"
                          onClick={() =>
                            updateStatus(
                              user.id,
                              "Active"
                            )
                          }
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="user-action block"
                          onClick={() =>
                            updateStatus(
                              user.id,
                              "Blocked"
                            )
                          }
                        >
                          Block
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="users-footer">
              <span>
                Showing {filteredUsers.length} of{" "}
                {users.length} users
              </span>

              <span>
                Backend integration will replace this
                mock data.
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Users;