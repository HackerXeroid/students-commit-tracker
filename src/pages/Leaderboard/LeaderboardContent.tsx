"use client";

import { useState, useEffect, useContext } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../../components/ui/badge";
import SelectTag from "../../components/SelectTag";
import DateTag from "@/components/DateTag";

import { LoaderContext } from "@/contexts/LoaderContext";
import {
  GetAllTimeLeaderboard,
  GetDateSpecificLeaderboard,
} from "@/api/leaderboard";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import { AssignmentSubmission } from "@/types";

type Student = {
  id: string;
  name: string;
  email: string;
  score: string;
  rank: string;
};

type StudentData = {
  id: string;
  name: string;
  email: string;
  totalScore: number;
  rank: number;
  submissions: number;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Badge>Rank</Badge>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rank = parseFloat(row.getValue("rank"));

      return (
        <Badge variant={"outline"} className="">
          {rank}
        </Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Badge>Name</Badge>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Badge>Email</Badge>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "score",
    header: () => <Badge>Score</Badge>,
    cell: ({ row }) => {
      const score = parseFloat(row.getValue("score"));

      return <div className="font-medium">{score}</div>;
    },
  },
];

function LeaderboardContent() {
  const [data, setData] = useState<Student[]>([]);
  const { loaderState, loaderDispatch } = useContext(LoaderContext);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterBy, setFilterBy] = useState<string>("email");
  const [rowSelection, setRowSelection] = useState({});

  const { toast } = useToast();

  const fetchAndSetLeaderboardCurrentDate = async (date: Date = new Date()) => {
    loaderDispatch({
      type: "SHOW_LOADER",
    });

    try {
      const submissions = await GetDateSpecificLeaderboard(date);
      const leaderboardData = submissions.data.map(
        (submission: AssignmentSubmission) => {
          const studentData = {
            id: submission.id,
            name: submission.student.name,
            email: submission.student.email,
            score: submission.score + "",
            rank: submission.rank + "",
          };

          return studentData;
        }
      );

      setData(leaderboardData);
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to fetch leaderboard data...",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      loaderDispatch({
        type: "HIDE_LOADER",
      });
    }
  };

  const fetchAndSetLeaderboardAllTime = async () => {
    loaderDispatch({
      type: "SHOW_LOADER",
    });

    try {
      let leaderboardData = await GetAllTimeLeaderboard();
      leaderboardData = leaderboardData.data.map((studentData: StudentData) => {
        const newStudentData = {
          id: studentData.id,
          rank: studentData.rank + "",
          score: studentData.totalScore + "",
          name: studentData.name,
          email: studentData.email,
        };

        return newStudentData;
      });

      setData(leaderboardData);
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to fetch leaderboard data...",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      loaderDispatch({
        type: "HIDE_LOADER",
      });
    }
  };

  useEffect(() => {
    (async () => await fetchAndSetLeaderboardCurrentDate())();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const onFilterByChange = (value: string) => {
    setFilterBy(value);
    table.getColumn(filterBy)?.setFilterValue("");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-2 justify-start">
          <Input
            placeholder={`Filter ${filterBy}s...`}
            value={
              (table.getColumn(filterBy)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn(filterBy)?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
          <SelectTag
            options={["rank", "name", "email", "score"]}
            label="Filter by"
            defaultOption="email"
            placeholder="Filter by"
            onValueChange={onFilterByChange}
          />
        </div>
        <DateTag
          buttonText="Get all time"
          onSelectDate={fetchAndSetLeaderboardCurrentDate}
          onButtonClick={fetchAndSetLeaderboardAllTime}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!loaderState.loading ? (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader variant="hourglass" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default LeaderboardContent;
