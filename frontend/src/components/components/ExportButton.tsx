import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { jsonToCsv, downloadCsv } from "../utils/export";
import { toast } from "sonner";

interface ExportButtonProps<T> {
  data: T[];
  columns: string[];
  columnTitles: string[];
  filename: string;
  disabled?: boolean;
}

export const ExportButton = <T,>({ data, columns, columnTitles, filename, disabled = false }: ExportButtonProps<T>) => {
  const handleExport = () => {
    if (data.length === 0) {
      toast.info("No data available to export.");
      return;
    }
    
    try {
      const csvContent = jsonToCsv(data, columns, columnTitles);
      downloadCsv(csvContent, filename);
      toast.success(`Successfully exported ${data.length} records to ${filename}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data. Check console for details.");
    }
  };

  return (
    <Button onClick={handleExport} disabled={disabled} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
};
