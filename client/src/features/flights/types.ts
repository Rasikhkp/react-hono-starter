export type Flight = {
  id: string;
  flightCode: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
  duration: string;
  status: "On Time" | "Delayed" | "Cancelled" | "Boarding";
  gate: string;
};
