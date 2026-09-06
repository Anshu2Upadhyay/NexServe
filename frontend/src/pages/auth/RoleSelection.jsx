import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    id: "customer",
    title: "Customer",
    description:
      "Find trusted local workers and get your work done.",
    icon: UserRound,
  },
  {
    id: "worker",
    title: "Worker",
    description:
      "Find nearby jobs and grow your local work.",
    icon: BriefcaseBusiness,
  },
  {
    id: "admin",
    title: "Admin",
    description:
      "Manage users, workers, jobs and the platform.",
    icon: ShieldCheck,
  },
];

function RoleSelection() {
  const navigate = useNavigate();

  const selectRole = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <main className="auth-page">
      <div className="auth-container role-container">
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="auth-heading">
          <div className="brand-logo large">N</div>

          <h1>Welcome to NexServe</h1>

          <p>
            Choose how you want to use NexServe.
          </p>
        </div>

        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                className="role-card"
                onClick={() => selectRole(role.id)}
              >
                <div className="role-icon">
                  <Icon size={26} />
                </div>

                <div className="role-content">
                  <h2>{role.title}</h2>

                  <p>{role.description}</p>
                </div>

                <ArrowRight
                  className="role-arrow"
                  size={20}
                />
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default RoleSelection;