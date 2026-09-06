import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import Transactions from "../pages/Transactions";

// Customer
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CreateJob from "../pages/customer/CreateJob";
import MyJobs from "../pages/customer/MyJobs";
import JobDetails from "../pages/customer/JobDetails";

// Worker
import WorkerDashboard from "../pages/worker/WorkerDashboard";
import AvailableJobs from "../pages/worker/AvailableJobs";
import WorkerMyJobs from "../pages/worker/WorkerMyJobs";
import WorkerJobDetails from "../pages/worker/WorkerJobDetails";
import WorkerProfile from "../pages/worker/WorkerProfile";
import WorkerEarnings from "../pages/worker/WorkerEarnings";


function AppRoutes() {
    return (
        <Routes>

            {/* =========================
                PUBLIC
            ========================= */}

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
            />


            {/* =========================
                CUSTOMER
            ========================= */}

            <Route
                path="/customer/dashboard"
                element={<CustomerDashboard />}
            />

            <Route
                path="/customer/create-job"
                element={<CreateJob />}
            />

            <Route
                path="/customer/my-jobs"
                element={<MyJobs />}
            />

            <Route
                path="/customer/jobs/:id"
                element={<JobDetails />}
            />


            {/* =========================
                WORKER
            ========================= */}

            <Route
                path="/worker/dashboard"
                element={<WorkerDashboard />}
            />

            <Route
                path="/worker/available-jobs"
                element={<AvailableJobs />}
            />

            <Route
                path="/worker/my-jobs"
                element={<WorkerMyJobs />}
            />

            <Route
                path="/worker/jobs/:id"
                element={<WorkerJobDetails />}
            />

            <Route
                path="/worker/profile"
                element={<WorkerProfile />}
            />

            <Route
                path="/worker/earnings"
                element={<WorkerEarnings />}
            />


            {/* =========================
                COMMON PAGES
            ========================= */}

            <Route
                path="/settings"
                element={<Settings />}
            />

            <Route
                path="/notifications"
                element={<Notifications />}
            />

            <Route
                path="/transactions"
                element={<Transactions />}
            />


            {/* =========================
                DEFAULT
            ========================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login?role=customer"
                        replace
                    />
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login?role=customer"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default AppRoutes;