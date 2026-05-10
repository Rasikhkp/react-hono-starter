import type { Flight } from "../types";

export const getFlightStatusColor = (status: Flight["status"]) => {
  switch (status) {
    case "On Time":
      return "bg-emerald-500";
    case "Delayed":
      return "bg-amber-500";
    case "Cancelled":
      return "bg-red-500";
    case "Boarding":
      return "bg-blue-500";
    default:
      return "bg-muted-foreground/64";
  }
};
