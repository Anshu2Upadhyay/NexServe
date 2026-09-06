import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Search,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import jobService from "../services/jobService";

const Transactions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filter, setFilter] = useState("All");

  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD TRANSACTIONS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await jobService.getTransactions();

        if (mounted) {
          setTransactions(
            Array.isArray(data) ? data : []
          );
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.message ||
              "Unable to load transactions."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => {
        const matchesFilter =
          filter === "All" ||
          transaction.status === filter ||
          transaction.type === filter;

        const query =
          search.toLowerCase().trim();

        const matchesSearch =
          !query ||
          transaction.id
            ?.toLowerCase()
            .includes(query) ||
          transaction.job
            ?.toLowerCase()
            .includes(query) ||
          transaction.method
            ?.toLowerCase()
            .includes(query);

        return (
          matchesFilter &&
          matchesSearch
        );
      }
    );
  }, [transactions, filter, search]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalSpent = transactions
    .filter(
      (transaction) =>
        transaction.type === "Payment" &&
        transaction.status === "Completed"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );

  const totalEarnings = transactions
    .filter(
      (transaction) =>
        transaction.type === "Earning" &&
        transaction.status === "Completed"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );

  const pendingAmount = transactions
    .filter(
      (transaction) =>
        transaction.status === "Pending"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );

  const paymentMethods = new Set(
    transactions
      .map(
        (transaction) =>
          transaction.method
      )
      .filter(Boolean)
  ).size;

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await jobService.getTransactions();

      setTransactions(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="dashboard-content">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="page-heading-row">
            <div>
              <span className="page-eyebrow">
                FINANCE
              </span>

              <h1>Transactions</h1>

              <p>
                Track your payments, earnings and
                transaction history.
              </p>
            </div>
          </section>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="transactions-error">
              <span>{error}</span>

              <button
                type="button"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="transaction-summary-grid">
            <div className="transaction-summary-card">
              <div className="transaction-summary-icon spent">
                <ArrowUpRight size={17} />
              </div>

              <div>
                <span>Total Spent</span>

                <strong>
                  ₹{totalSpent.toLocaleString()}
                </strong>

                <small>
                  Completed payments
                </small>
              </div>
            </div>

            <div className="transaction-summary-card">
              <div className="transaction-summary-icon earnings">
                <ArrowDownLeft size={17} />
              </div>

              <div>
                <span>Total Earnings</span>

                <strong>
                  ₹
                  {totalEarnings.toLocaleString()}
                </strong>

                <small>
                  Completed worker earnings
                </small>
              </div>
            </div>

            <div className="transaction-summary-card">
              <div className="transaction-summary-icon pending">
                <Wallet size={17} />
              </div>

              <div>
                <span>Pending</span>

                <strong>
                  ₹
                  {pendingAmount.toLocaleString()}
                </strong>

                <small>
                  Awaiting confirmation
                </small>
              </div>
            </div>

            <div className="transaction-summary-card">
              <div className="transaction-summary-icon secure">
                <CreditCard size={17} />
              </div>

              <div>
                <span>Payment Methods</span>

                <strong>
                  {paymentMethods}
                </strong>

                <small>
                  Used payment methods
                </small>
              </div>
            </div>
          </section>

          {/* =================================================
              TRANSACTION PANEL
          ================================================= */}

          <section className="transactions-panel">
            <div className="transactions-toolbar">
              <div className="transactions-search">
                <Search size={13} />

                <input
                  type="text"
                  placeholder="Search transaction or job..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="transactions-filters">
                {[
                  "All",
                  "Completed",
                  "Pending",
                  "Refunded",
                  "Earning",
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

            <div className="transactions-table-wrapper">
              {loading ? (
                <div className="transactions-loading">
                  <div className="transactions-spinner" />

                  <strong>
                    Loading transactions...
                  </strong>

                  <span>
                    Please wait a moment.
                  </span>
                </div>
              ) : (
                <>
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>
                          Transaction
                        </th>

                        <th>Job</th>

                        <th>Type</th>

                        <th>Amount</th>

                        <th>Method</th>

                        <th>Status</th>

                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTransactions.map(
                        (transaction) => (
                          <tr
                            key={
                              transaction.id
                            }
                          >
                            <td>
                              <div className="transaction-id">
                                <div className="transaction-row-icon">
                                  {transaction.type ===
                                  "Earning" ? (
                                    <ArrowDownLeft
                                      size={12}
                                    />
                                  ) : (
                                    <ArrowUpRight
                                      size={12}
                                    />
                                  )}
                                </div>

                                <div>
                                  <strong>
                                    {
                                      transaction.id
                                    }
                                  </strong>

                                  <span>
                                    Transaction ID
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="transaction-job">
                                {
                                  transaction.job
                                }
                              </span>
                            </td>

                            <td>
                              <span
                                className={`transaction-type ${transaction.type
                                  ?.toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                              >
                                {
                                  transaction.type
                                }
                              </span>
                            </td>

                            <td>
                              <strong className="transaction-amount">
                                ₹
                                {Number(
                                  transaction.amount ||
                                    0
                                ).toLocaleString()}
                              </strong>
                            </td>

                            <td>
                              <span className="transaction-method">
                                {
                                  transaction.method
                                }
                              </span>
                            </td>

                            <td>
                              <span
                                className={`transaction-status ${transaction.status
                                  ?.toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                              >
                                <CheckCircle2
                                  size={10}
                                />

                                {
                                  transaction.status
                                }
                              </span>
                            </td>

                            <td>
                              <span className="transaction-date">
                                {
                                  transaction.date
                                }
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {filteredTransactions.length ===
                    0 && (
                    <div className="transactions-empty">
                      <Wallet size={22} />

                      <strong>
                        No transactions found
                      </strong>

                      <span>
                        Try changing the filter
                        or search term.
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <div className="transactions-demo-note">
            <IndianRupee size={13} />

            <span>
              Transaction data is currently
              provided through the service layer.
              The same component can later use the
              real backend API.
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;