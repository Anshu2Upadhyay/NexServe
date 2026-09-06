import {
  ArrowRight,
  MapPin,
  IndianRupee,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div>
          <span className="job-category">
            {job.category}
          </span>

          <h3>{job.title}</h3>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <p className="job-description">
        {job.description}
      </p>

      <div className="job-meta">
        <div>
          <MapPin size={17} />
          <span>{job.location}</span>
        </div>

        <div>
          <IndianRupee size={17} />
          <span>
            ₹{job.budget.min} - ₹{job.budget.max}
          </span>
        </div>

        <div>
          <Clock size={17} />
          <span>{job.createdAt}</span>
        </div>
      </div>

      <div className="job-card-footer">
        <span className="job-distance">
          {job.distance} away
        </span>

        <button
          className="view-job-btn"
          onClick={handleView}
        >
          View Details
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;