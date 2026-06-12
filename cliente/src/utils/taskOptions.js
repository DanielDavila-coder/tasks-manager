export const statusOptions = ["pending", "in progress", "completed"];

export const priorityOptions = ["low", "medium", "high", "urgent"];

export const statusColors = {
  pending: "bg-yellow-500 hover:bg-yellow-600",
  "in progress": "bg-green-600 hover:bg-green-700",
  completed: "bg-purple-600 hover:bg-purple-700",
};

export const priorityColors = {
  urgent: "border-red-500/40 bg-red-600/10 text-red-300",
  high: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  medium: "border-blue-500/40 bg-blue-600/10 text-blue-300",
  low: "border-pink-500/40 bg-pink-600/10 text-pink-300",
};

export const priorityWeight = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const statusLabels = {
  pending: "Pending",
  "in progress": "In Progress",
  completed: "Completed",
};

export const statusAccentColors = {
  pending: "bg-yellow-500",
  "in progress": "bg-green-600",
  completed: "bg-purple-600",
};

export const areaOptions = ["work", "study", "personal"];

export const areaLabels = {
  work: "Work",
  study: "Study",
  personal: "Personal",
};

export const areaTabs = [
  { value: "all", label: "All tasks" },
  ...areaOptions.map((area) => ({
    value: area,
    label: areaLabels[area],
  })),
];

export const getAreaLabel = (area) =>
  area === "all" ? "All tasks" : areaLabels[area] || "Personal";

export const getTaskArea = (task) => task.area || "personal";
