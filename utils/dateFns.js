import { format } from "date-fns";

const formatDate = (date, formatString) => {
  return format(new Date(date), formatString || "do MMMM , yyyy");
};

export { formatDate };
