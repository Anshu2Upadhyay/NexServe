const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();
  let className = "status-badge";

  if (normalizedStatus === "available") className += " status-available";
  else if (normalizedStatus === "in progress") className += " status-progress";
  else if (normalizedStatus === "worker on the way") className += " status-progress";
  else if (normalizedStatus === "completed") className += " status-completed";
  else if (normalizedStatus === "cancelled") className += " status-cancelled";
  else if (normalizedStatus === "pending") className += " status-pending";

  return (
    <span className={className}>
      <span className="status-dot" />
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
