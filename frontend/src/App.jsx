import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import "./App.css";
import "./styles.css";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../components/ProtectedRoute";

import CustomerHome from "../customer/CustomerHome";
import CustomerDashboard from "../customer/CustomerDashboard";
import PostJob from "../customer/PostJob";
import NyJobs from "../customer/NyJobs";
import JobDetails from "../customer/JobDetails";
import Payment from "../customer/Payment";

import WorkerDashboard from "../worker/WorkerDashboard";
import AvailableJobs from "../worker/AvailableJobs";
import WorkerJobDetails from "../worker/WorkerJobDetails";
import WorkerNotifications from "../worker/WorkerNotifications";
import WorkerProfile from "../worker/WorkerProfile";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
                    PUBLIC
                ========================= */}

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


                {/* =========================
                    CUSTOMER
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRole="customer"
                        />
                    }
                >

                    {/* CUSTOMER ROOT */}
                    <Route
                        path="/customer"
                        element={
                            <Navigate
                                to="/customer/home"
                                replace
                            />
                        }
                    />

                    {/* CUSTOMER HOME */}
                    <Route
                        path="/customer/home"
                        element={<CustomerHome />}
                    />

                    {/* CUSTOMER DASHBOARD */}
                    <Route
                        path="/customer/dashboard"
                        element={<CustomerDashboard />}
                    />

                    {/* POST JOB */}
                    <Route
                        path="/customer/post-job"
                        element={<PostJob />}
                    />

                    {/* MY JOBS */}
                    <Route
                        path="/customer/my-jobs"
                        element={<NyJobs />}
                    />

                    {/* JOB DETAILS */}
                    <Route
                        path="/customer/job/:jobId"
                        element={<JobDetails />}
                    />

                    {/* PAYMENT */}
                    <Route
                        path="/customer/payment/:jobId"
                        element={<Payment />}
                    />

                </Route>


                {/* =========================
                    WORKER
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRole="worker"
                        />
                    }
                >

                    <Route
                        path="/worker"
                        element={
                            <Navigate
                                to="/worker/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/worker/dashboard"
                        element={<WorkerDashboard />}
                    />

                    <Route
                        path="/worker/available-jobs"
                        element={<AvailableJobs />}
                    />

                    <Route
                        path="/worker/jobs"
                        element={<AvailableJobs />}
                    />

                    <Route
                        path="/worker/job/:jobId"
                        element={<WorkerJobDetails />}
                    />

                    <Route
                        path="/worker/jobs/:jobId"
                        element={<WorkerJobDetails />}
                    />

                    <Route
                        path="/worker/notifications"
                        element={<WorkerNotifications />}
                    />

                    <Route
                        path="/worker/profile"
                        element={<WorkerProfile />}
                    />

                </Route>


                {/* =========================
                    FALLBACK
                ========================= */}

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