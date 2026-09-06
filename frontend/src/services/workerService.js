import initialWorkerData from "../data/workerData";

const STORAGE_KEY = "nexserve_workers_v1";
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));

const readWorkers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fall back to seed data.
  }

  const seed = clone(initialWorkerData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

const writeWorkers = (workers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
};

const workerService = {
  async getWorkers() {
    await delay();
    return clone(readWorkers());
  },

  async getAvailableWorkers() {
    await delay();
    return clone(readWorkers().filter((worker) => worker.isAvailable));
  },

  async getWorkerById(id) {
    await delay();
    return clone(readWorkers().find((worker) => String(worker.id) === String(id)) || null);
  },

  async getWorkersByCategory(category) {
    await delay();
    if (!category || category === "All") return clone(readWorkers());
    return clone(
      readWorkers().filter(
        (worker) => worker.category?.toLowerCase() === category.toLowerCase()
      )
    );
  },

  async updateAvailability(id, isAvailable) {
    await delay();
    const workers = readWorkers();
    const worker = workers.find((item) => String(item.id) === String(id));
    if (!worker) throw new Error("Worker not found.");
    worker.isAvailable = Boolean(isAvailable);
    writeWorkers(workers);
    return clone(worker);
  },

  async updateProfile(id, updates = {}) {
    await delay();
    const workers = readWorkers();
    const worker = workers.find((item) => String(item.id) === String(id));
    if (!worker) throw new Error("Worker not found.");

    Object.assign(worker, {
      name: updates.name?.trim() || worker.name,
      phone: updates.phone?.trim() || worker.phone,
      category: updates.category || worker.category,
      experience: updates.experience?.trim() || worker.experience,
      location: updates.location?.trim() || worker.location,
      bio: updates.bio?.trim() || worker.bio,
      skills: Array.isArray(updates.skills) && updates.skills.length
        ? updates.skills
        : worker.skills,
    });

    writeWorkers(workers);
    return clone(worker);
  },
};

export default workerService;
