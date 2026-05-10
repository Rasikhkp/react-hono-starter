import { DataTable } from "@/shared/components/data-table/DataTable";
import { exportFlightData } from "../lib/exportFlightData";
import { filterableFlightsColumns } from "../lib/filterableFlightsColumns";
import { flightsColumns } from "../lib/flightsColumns";
import { flightsData } from "../lib/flightsData";

export function FlightsTable() {
  return (
    <DataTable
      data={flightsData}
      columns={flightsColumns}
      searchColumn="destination"
      searchPlaceholder="Search destination..."
      filterableColumns={filterableFlightsColumns}
      onExport={exportFlightData}
      defaultSort={[{ id: "departureTime", desc: false }]}
    />
  );
}
