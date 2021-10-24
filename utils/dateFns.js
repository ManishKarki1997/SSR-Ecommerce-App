import { format, formatDuration, isAfter, intervalToDuration } from "date-fns";

const formatDate = (date, formatString) => {
  return format(new Date(date), formatString || "do MMMM , yyyy");
};

const calculateCountdown = (start = new Date(), end) => {
  const units = ["Y", "M", "D", "H", "M", "S"];

  const duration = intervalToDuration({
    start: new Date(start),
    end: new Date(end)
  });

  let formatted = "";
  Object.keys(duration).forEach((d, idx) => {
    if (duration[d] > 0) {
      formatted += `${duration[d]}${units[idx]}${
        idx < units.length - 1 ? " : " : ""
      }`;
    }
  });

  return formatted;
};

const checkIfDateAfter = (date, dateToCompare) => {
  return isAfter(new Date(date), new Date(dateToCompare));
};

export { formatDate, calculateCountdown, checkIfDateAfter };
