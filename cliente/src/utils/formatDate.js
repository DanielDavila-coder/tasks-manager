import dayjs from "dayjs";

export const formatDate = (date, fallback = "No due date") => {
  if (!date) return fallback;

  return dayjs(date).format("DD/MM/YYYY");
};
