"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export type LeaderboardEntry = {
  rank: number;
  studentName: string;
  department: string;
  points: number;
};

export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const rank = row.getValue("rank") as number;
        if (rank === 1) return <Badge className="bg-yellow-500 hover:bg-yellow-600">#1</Badge>;
        if (rank === 2) return <Badge className="bg-slate-400 hover:bg-slate-500">#2</Badge>;
        if (rank === 3) return <Badge className="bg-amber-700 hover:bg-amber-800">#3</Badge>;
        return <div className="font-medium text-lg">{rank}</div>;
    }
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const points = row.getValue("points") as number;
        return <div className="font-bold text-primary">{points}</div>;
    }
  },
];