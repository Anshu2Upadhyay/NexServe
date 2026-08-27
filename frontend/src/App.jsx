import React from "react";
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
import MyJobs from "../customer/MyJobs";
import JobDetails from "../customer/JobDetails";
import Payment from "../customer/Payment";

/* =========================
   WORKER
========================= */

import WorkerDashboard from "../worker/WorkerDashboard";
import AvailableJobs from "../worker/AvailableJobs";
import WorkerJobDetails from "../worker/WorkerJobDetails";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =========================================
                    PUBLIC ROUTES
                ========================================= */}

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


                {/* =========================================
                    CUSTOMER ROUTES
                ========================================= */}

                <Route
                    element={
                        <ProtectedRoute role="customer" />
                    }
                >

                    {/* /customer */}
                    <Route
                        path="/customer"
                        element={
                            <Navigate
                                to="/customer/dashboard"
                                replace
                            />
                        }
                    />

                    {/* Customer Dashboard */}
                    <Route
                        path="/customer/dashboard"
                        element={
                            <CustomerDashboard />
                        }
                    />

                    {/* Post Job */}
                    <Route
                        path="/customer/post-job"
                        element={
                            <PostJob />
                        }
                    />

                    {/* My Jobs */}
                    <Route
                        path="/customer/my-jobs"
                        element={
                            <MyJobs />
                        }
                    />

                    {/* Customer Job Details */}
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


                {/* =========================================
                    WORKER ROUTES
                ========================================= */}

                <Route
                    element={
                        <ProtectedRoute role="worker" />
                    }
                >

                    {/* /worker */}
                    <Route
                        path="/worker"
                        element={
                            <Navigate
                                to="/worker/dashboard"
                                replace
                            />
                        }
                    />

                    {/* Worker Dashboard */}
                    <Route
                        path="/worker/dashboard"
                        element={
                            <WorkerDashboard />
                        }
                    />

                    {/* Available Jobs */}
                    <Route
                        path="/worker/available-jobs"
                        element={
                            <AvailableJobs />
                        }
                    />

                    {/* Shortcut */}
                    <Route
                        path="/worker/jobs"
                        element={
                            <AvailableJobs />
                        }
                    />

                    {/* Worker Job Details */}
                    <Route
                        path="/worker/job/:jobId"
                        element={
                            <WorkerJobDetails />
                        }
                    />

                    {/* AvailableJobs ke View Job ke liye */}
                    <Route
                        path="/worker/jobs/:jobId"
                        element={
                            <WorkerJobDetails />
                        }
                    />

                </Route>


                {/* =========================================
                    FALLBACK
                ========================================= */}

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