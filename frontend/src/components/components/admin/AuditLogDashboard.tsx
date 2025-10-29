import { useState, useEffect, useMemo, useCallback } from "react";
import { useData } from "../../context/DataContext";
import { AuditLog } from "../../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { DataTable } from "../DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";

// Define columns for the Audit Log table
const auditLogColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      return format(new Date(row.original.timestamp), "MMM dd, yyyy HH:mm:ss");
    },
  },
  {
    accessorKey: "actorName",
    header: "Actor",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
        const action = row.getValue("action") as string;
        const variant = action.includes('APPROVED') ? 'default' : action.includes('REJECTED') ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{action}</Badge>;
    }
  },
  {
    accessorKey: "targetType",
    header: "Target Type",
    cell: ({ row }) => <span className="capitalize">{row.getValue("targetType") as string}</span>
  },
  {
    accessorKey: "targetId",
    header: "Target ID",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("targetId") as string}</span>
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.getValue("details") as Record<string, unknown>;
      return (
        <div className="text-xs text-muted-foreground max-w-[200px] truncate">
          {JSON.stringify(details)}
        </div>
      );
    },
  },
];

export const AuditLogDashboard = () => {
  const { getAuditLogs } = useData();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    const { logs: fetchedLogs, totalCount: count } = await getAuditLogs(page + 1, pageSize);
    setLogs(fetchedLogs);
    setTotalCount(count);
    setLoading(false);
  }, [getAuditLogs]);

  useEffect(() => {
    fetchLogs(pagination.pageIndex, pagination.pageSize);
  }, [fetchLogs, pagination.pageIndex, pagination.pageSize]);

  const tableData = useMemo(() => logs, [logs]);

  if (loading && logs.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Audit Log</CardTitle>
        <CardDescription>
          A chronological record of all critical administrative actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable 
            columns={auditLogColumns} 
            data={tableData} 
            manualPagination={true}
            pageCount={Math.ceil(totalCount / pagination.pageSize)}
            pagination={pagination}
            setPagination={setPagination}
            totalRows={totalCount}
        />
      </CardContent>
    </Card>
  );
};
