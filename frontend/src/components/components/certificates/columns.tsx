"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Certificate } from "../../types"; // Updated import
import { ReviewCertificateDialog } from "./ReviewCertificateDialog";

export const columns: ColumnDef<Certificate>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Certificate Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted Date",
    cell: ({ row }) => {
        const date = new Date(row.getValue("submittedAt"));
        return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant: "default" | "destructive" | "secondary" = 
        status === 'approved' ? 'default' : 
        status === 'rejected' ? 'destructive' : 
        'secondary';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => {
        const points = row.getValue("points") as number;
        return <div className="font-medium">{points > 0 ? points : '-'}</div>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const certificate = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => window.open(certificate.fileUrl, '_blank')}
            >
              View File
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ReviewCertificateDialog certificate={certificate}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Review Submission
                </DropdownMenuItem>
            </ReviewCertificateDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];