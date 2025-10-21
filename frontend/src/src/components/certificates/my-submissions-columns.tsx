"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge"
import { Certificate } from "../../types"
import { format } from "date-fns"

export const columns: ColumnDef<Certificate>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted On",
    cell: ({ row }) => {
      return format(new Date(row.original.submittedAt), "PP")
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "approved" ? "default" : status === "pending" ? "secondary" : "destructive"
      return <Badge variant={variant} className="capitalize">{status}</Badge>
    },
  },
  {
    accessorKey: "points",
    header: "Points",
  },
]