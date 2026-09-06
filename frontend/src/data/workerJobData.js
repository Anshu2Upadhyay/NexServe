const workerJobData = [
  {
    id: "JOB1001",
    title: "Bathroom Pipe Repair",
    category: "Plumbing",
    description:
      "Bathroom sink ke neeche pipe leak ho raha hai. Pipe repair ya replacement ki zarurat hai.",
    location: "Pipraich, Gorakhpur",
    distance: "2.1 km",
    budget: {
      min: 300,
      max: 500,
    },
    postedTime: "15 min ago",
    customer: {
      name: "Rahul Kumar",
      rating: 4.6,
      jobs: 8,
    },
    status: "Available",
    priority: "Normal",
  },
  {
    id: "JOB1002",
    title: "Ceiling Fan Installation",
    category: "Electrical",
    description:
      "New ceiling fan install karwana hai. Existing wiring available hai.",
    location: "Gorakhpur",
    distance: "3.5 km",
    budget: {
      min: 400,
      max: 700,
    },
    postedTime: "32 min ago",
    customer: {
      name: "Priya Singh",
      rating: 4.8,
      jobs: 12,
    },
    status: "Available",
    priority: "High",
  },
  {
    id: "JOB1003",
    title: "Split AC Service",
    category: "AC Technician",
    description:
      "AC cooling properly nahi kar raha hai. General service aur inspection chahiye.",
    location: "Medical College Road, Gorakhpur",
    distance: "5.2 km",
    budget: {
      min: 500,
      max: 800,
    },
    postedTime: "1 hour ago",
    customer: {
      name: "Aman Verma",
      rating: 4.7,
      jobs: 5,
    },
    status: "Available",
    priority: "Normal",
  },
  {
    id: "JOB1004",
    title: "Kitchen Cabinet Repair",
    category: "Carpenter",
    description:
      "Kitchen cabinet ka door loose ho gaya hai aur hinges repair karne hain.",
    location: "Civil Lines, Gorakhpur",
    distance: "6.4 km",
    budget: {
      min: 350,
      max: 600,
    },
    postedTime: "2 hours ago",
    customer: {
      name: "Neha Gupta",
      rating: 4.5,
      jobs: 6,
    },
    status: "Available",
    priority: "Normal",
  },
  {
    id: "JOB1005",
    title: "Bedroom Wall Painting",
    category: "Painter",
    description:
      "Bedroom ki ek wall ko repaint karwana hai. Paint customer provide karega.",
    location: "Betiahata, Gorakhpur",
    distance: "7.2 km",
    budget: {
      min: 800,
      max: 1200,
    },
    postedTime: "3 hours ago",
    customer: {
      name: "Vivek Singh",
      rating: 4.4,
      jobs: 3,
    },
    status: "Available",
    priority: "Normal",
  },
];

export default workerJobData;