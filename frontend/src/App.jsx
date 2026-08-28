import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import "./App.css";
import "./styles.css";

// ======================================================
// AUTH
// ======================================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/ProtectedRoute";

// ======================================================
// CUSTOMER
// ======================================================

import CustomerHome from "./customer/CustomerHome";
import CustomerDashboard from "./customer/CustomerDashboard";
import PostJob from "./customer/PostJob";
import MyJobs from "./customer/MyJobs";
import JobDetails from "./customer/JobDetails";
import Payment from "./customer/Payment";

// ======================================================
// WORKER
// ======================================================

import WorkerDashboard from "./worker/WorkerDashboard";
import AvailableJobs from "./worker/AvailableJobs";
import WorkerJobDetails from "./worker/WorkerJobDetails";
import WorkerNotifications from "./worker/WorkerNotifications";
import WorkerProfile from "./worker/WorkerProfile";


// ======================================================
// APP
// ======================================================

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==================================================
                    PUBLIC ROUTES
                ================================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==================================================
                    CUSTOMER ROUTES
                ================================================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRole="customer"
                        />
                    }
                >

                    {/* Customer root */}
                    <Route
                        path="/customer"
                        element={
                            <Navigate
                                to="/customer/home"
                                replace
                            />
                        }
                    />

                    {/* Customer home */}
                    <Route
                        path="/customer/home"
                        element={
                            <CustomerHome />
                        }
                    />

                    {/* Customer dashboard */}
                    <Route
                        path="/customer/dashboard"
                        element={
                            <CustomerDashboard />
                        }
                    />

                    {/* Post job */}
                    <Route
                        path="/customer/post-job"
                        element={
                            <PostJob />
                        }
                    />

                    {/* My jobs */}
                    <Route
                        path="/customer/my-jobs"
                        element={
                            <MyJobs />
                        }
                    />

                    {/* Single job */}
                    <Route
                        path="/customer/job/:jobId"
                        element={
                            <JobDetails />
                        }
                    />

                    {/* Payment */}
                    <Route
                        path="/customer/payment/:jobId"
                        element={
                            <Payment />
                        }
                    />

                </Route>


                {/* ==================================================
                    WORKER ROUTES
                ================================================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRole="worker"
                        />
                    }
                >

                    {/* Worker root */}
                    <Route
                        path="/worker"
                        element={
                            <Navigate
                                to="/worker/dashboard"
                                replace
                            />
                        }
                    />

                    {/* Dashboard */}
                    <Route
                        path="/worker/dashboard"
                        element={
                            <WorkerDashboard />
                        }
                    />

                    {/* Available jobs */}
                    <Route
                        path="/worker/available-jobs"
                        element={
                            <AvailableJobs />
                        }
                    />

                    {/* Backward-compatible route */}
                    <Route
                        path="/worker/jobs"
                        element={
                            <AvailableJobs />
                        }
                    />

                    {/* Worker job details */}
                    <Route
                        path="/worker/job/:jobId"
                        element={
                            <WorkerJobDetails />
                        }
                    />

                    {/* Backward-compatible route */}
                    <Route
                        path="/worker/jobs/:jobId"
                        element={
                            <WorkerJobDetails />
                        }
                    />

                    {/* Notifications */}
                    <Route
                        path="/worker/notifications"
                        element={
                            <WorkerNotifications />
                        }
                    />

                    {/* Profile */}
                    <Route
                        path="/worker/profile"
                        element={
                            <WorkerProfile />
                        }
                    />

                </Route>


                {/* ==================================================
                    FALLBACK
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;