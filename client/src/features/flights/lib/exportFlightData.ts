import type { Flight } from "../types";

export function exportFlightData(data: Flight[]) {
  const csv = [
    ["Flight", "Destination", "Departure", "Arrival", "Status", "Gate"].join(
      ",",
    ),
    ...data.map((f) =>
      [
        f.flightCode,
        f.destination,
        f.departureTime,
        f.arrivalTime,
        f.status,
        f.gate,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flights.csv";
  a.click();
  URL.revokeObjectURL(url);
}
