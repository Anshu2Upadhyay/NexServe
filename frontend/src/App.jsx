import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import "./App.css";
import "./styles.css";


/* =========================
   AUTH
========================= */

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


/* =========================
   COMPONENTS
========================= */

import ProtectedRoute from "../components/ProtectedRoute";


/* =========================
   CUSTOMER
========================= */

import CustomerDashboard from "../customer/CustomerDashboard";
import PostJob from "../customer/PostJob";
import NyJobs from "../customer/NyJobs";
import JobDetails from "../customer/JobDetails";
import Payment from "../customer/Payment";


/* =========================
   WORKER
========================= */

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
                            role="customer"
                        />
                    }
                >

                    <Route
                        path="/customer"
                        element={
                            <Navigate
                                to="/customer/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/customer/dashboard"
                        element={
                            <CustomerDashboard />
                        }
                    />

                    <Route
                        path="/customer/post-job"
                        element={
                            <PostJob />
                        }
                    />

                    <Route
                        path="/customer/my-jobs"
                        element={
                            <NyJobs />
                        }
                    />

                    <Route
                        path="/customer/job/:jobId"
                        element={
                            <JobDetails />
                        }
                    />

                    <Route
                        path="/customer/payment/:jobId"
                        element={
                            <Payment />
                        }
                    />

                </Route>


                {/* =========================
                    WORKER
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute
                            role="worker"
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
                        element={
                            <WorkerDashboard />
                        }
                    />

                    <Route
                        path="/worker/available-jobs"
                        element={
                            <AvailableJobs />
                        }
                    />

                    <Route
                        path="/worker/jobs"
                        element={
                            <AvailableJobs />
                        }
                    />

                    <Route
                        path="/worker/job/:jobId"
                        element={
                            <WorkerJobDetails />
                        }
                    />

                    <Route
                        path="/worker/jobs/:jobId"
                        element={
                            <WorkerJobDetails />
                        }
                    />

                    <Route
                        path="/worker/notifications"
                        element={
                            <WorkerNotifications />
                        }
                    />

                    <Route
                        path="/worker/profile"
                        element={
                            <WorkerProfile />
                        }
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