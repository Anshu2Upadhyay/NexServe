const jobData = [
  {
    id: "JOB001",
    title: "Bathroom Pipe Repair",
    category: "Plumbing",
    description:
      "Bathroom sink ke neeche pipe leak ho raha hai. Pipe check karke repair karna hai.",
    location: "Pipraich, Gorakhpur",
    budget: {
      min: 300,
      max: 500,
    },
    status: "Available",
    customer: {
      name: "Rahul Kumar",
      phone: "9876543210",
    },
    worker: null,
    createdAt: "Today, 10:30 AM",
    distance: "2.4 km",
  },
  {
    id: "JOB002",
    title: "Ceiling Fan Installation",
    category: "Electrical",
    description:
      "New ceiling fan install karwana hai aur wiring properly check karni hai.",
    location: "Gorakhpur Road, Pipraich",
    budget: {
      min: 400,
      max: 700,
    },
    status: "Available",
    customer: {
      name: "Amit Verma",
      phone: "9876543211",
    },
    worker: null,
    createdAt: "Today, 09:15 AM",
    distance: "3.1 km",
  },
  {
    id: "JOB003",
    title: "AC Service",
    category: "AC & Appliance",
    description:
      "Split AC cooling kam kar raha hai. General servicing aur gas leakage check karni hai.",
    location: "Medical College Road, Gorakhpur",
    budget: {
      min: 500,
      max: 900,
    },
    status: "In Progress",
    customer: {
      name: "Neha Singh",
      phone: "9876543212",
    },
    worker: {
      name: "Amit Sharma",
      phone: "9876543213",
      rating: 4.8,
    },
    createdAt: "Yesterday, 04:20 PM",
    distance: "5.8 km",
  },
  {
    id: "JOB004",
    title: "Kitchen Sink Repair",
    category: "Plumbing",
    description:
      "Kitchen sink ka drainage block hai aur tap ke paas leakage bhi hai.",
    location: "Civil Lines, Gorakhpur",
    budget: {
      min: 250,
      max: 450,
    },
    status: "Completed",
    customer: {
      name: "Priya Gupta",
      phone: "9876543214",
    },
    worker: {
      name: "Ravi Kumar",
      phone: "9876543215",
      rating: 4.7,
    },
    createdAt: "28 Aug 2026",
    distance: "7.2 km",
  },
];

export default jobData;