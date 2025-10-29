import { DataTable } from "../DataTable";
import { columns } from "./columns";

export function LeaderboardTable({ data }) {
  return (
    <div className="w-full">
      <DataTable columns={columns} data={data} />
    </div>
  );
}