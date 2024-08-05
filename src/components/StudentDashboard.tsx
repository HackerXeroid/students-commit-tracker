import React, { useContext, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetAssignments } from "@/api/student";
import { toast, useToast } from "./ui/use-toast";
import { LoaderContext } from "@/contexts/LoaderContext";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { UserContext } from "@/contexts/UserContext";
import GradingSpinner from "./GradingSpinner";
import { CreateAndGradeSubmission } from "@/api/submission";

interface Assignment {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "Completed" | "Missed";
  dueDate: string;
  yourScore: number | null;
  totalScore: number;
}

interface SubmitButtonProps {
  onSubmit: (githubLink: string) => Promise<void>;
  disabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit, disabled }) => {
  const [githubLink, setGithubLink] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGithubLink("");
    setIsOpen(false);

    await onSubmit(githubLink);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Your Assignment</DialogTitle>
          <DialogDescription>
            Once you're ready, click the button below to submit your work.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid mb-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="github-link"
                className="text-left text-sm font-semibold"
              >
                GitHub Repository:
              </Label>
              <Input
                id="github-link"
                placeholder="https://github.com/user/repo"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Assignment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface TableRowComponentProps {
  item: Assignment;
  studentId: string;
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

const TableRowComponent = ({
  item,
  studentId,
  setAssignments,
}: TableRowComponentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const assignmentId = item.id;

  const handleSubmit = async (githubLink: string) => {
    try {
      setIsSubmitting(true);
      console.log({
        assignmentId,
        studentId,
        githubLink,
      });
      const res = await CreateAndGradeSubmission({
        assignmentId,
        studentId,
        githubLink,
      });
      console.log(res);

      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === assignmentId
            ? { ...assignment, status: "Completed", yourScore: res.data.score }
            : assignment
        )
      );
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to submit assignment",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
    // Write the code for updating the assignment status of assignment with id = assignmentId to "Completed"
  };

  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.title}</TableCell>
      <TableCell className="w-5 overflow-hidden text-ellipsis whitespace-nowrap">
        {item.description}
      </TableCell>
      <TableCell>
        <Badge
          variant={
            item.status === "Completed"
              ? "secondary"
              : item.status === "Pending"
              ? "outline"
              : "destructive"
          }
        >
          {item.status}
        </Badge>
      </TableCell>
      <TableCell>
        {new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(item.dueDate))}
      </TableCell>
      {isSubmitting && <GradingSpinner />}
      {!isSubmitting && (
        <TableCell>{item.yourScore !== null ? item.yourScore : "-"}</TableCell>
      )}
      <TableCell>{item.totalScore}</TableCell>
      <TableCell>
        <SubmitButton
          onSubmit={handleSubmit}
          disabled={isSubmitting || item.yourScore !== null}
        />
      </TableCell>
    </TableRow>
  );
};

const StudentDashboard: React.FC = () => {
  const { loaderDispatch } = useContext(LoaderContext);
  const { userState } = useContext(UserContext);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<keyof Assignment>("title");
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "Completed"
  );

  const missedAssignments = assignments.filter(
    (assignment) => assignment.status === "Missed"
  );

  console.log(completedAssignments.length, "completedAssignments");
  console.log(missedAssignments.length, "missedAssignments");

  let averageScore = completedAssignments.reduce(
    (acc, curr) => acc + (curr.yourScore || 0),
    0
  );

  let sumCompletedAssignmentsTotalScore = completedAssignments.reduce(
    (acc, curr) => acc + curr.totalScore,
    0
  );

  sumCompletedAssignmentsTotalScore += missedAssignments.reduce(
    (acc, curr) => acc + curr.totalScore,
    0
  );

  averageScore = (averageScore * 100) / sumCompletedAssignmentsTotalScore;
  averageScore = +averageScore.toFixed(1);

  const stats = {
    totalAssignments,
    completedAssignments: completedAssignments.length,
    averageScore,
  };

  const filterData = (data: Assignment[]): Assignment[] => {
    return data.filter((item) =>
      (item[searchColumn] + "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getAssignmentsByStatus = (status: Assignment["status"]) => {
    return assignments.filter((assignment) => assignment.status === status);
  };

  const getAssignmentsData = async () => {
    try {
      const response = await GetAssignments();
      return response.data;
    } catch (err) {
      let errMsg = "Something went wrong";
      if (err instanceof Error) errMsg = err.message;
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  useEffect(() => {
    loaderDispatch({ type: "SHOW_LOADER" });
    (async () => {
      const assignmentsData = await getAssignmentsData();
      setAssignments(assignmentsData);
    })();
    loaderDispatch({ type: "HIDE_LOADER" });
  }, []);

  const handleSubmitAssignment = async (studentSubmission: {
    assignmentId: string;
    githubLink: string;
    studentId: string;
  }) => {
    try {
      console.log(studentSubmission);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === studentSubmission.assignmentId
            ? { ...assignment, status: "Completed" }
            : assignment
        )
      );

      toast({
        title: "Success",
        description: "Assignment submitted successfully",
        variant: "default",
        duration: 1500,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit assignment",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  return (
    <div className="flex w-full flex-col bg-muted/40 pt-4 mt-10">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Student Dashboard
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedAssignments}
              </div>
              <Progress
                value={Math.round(
                  stats.totalAssignments === 0
                    ? 100
                    : (stats.completedAssignments / stats.totalAssignments) *
                        100
                )}
                max={100}
                className="mt-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalAssignments === 0
                  ? 100
                  : stats.averageScore.toFixed(1)}
              </div>
              <Progress
                value={stats.totalAssignments === 0 ? 100 : stats.averageScore}
                max={100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
        <div className="pt-10">
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="missed">Missed</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="max-w-sm"
              />
              <Select
                onValueChange={(value: keyof Assignment) =>
                  setSearchColumn(value)
                }
                defaultValue={searchColumn}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(["Pending", "Completed", "Missed"] as const).map((tab) => (
              <TabsContent value={tab.toLowerCase()} key={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>{tab} Assignments</CardTitle>
                    <CardDescription>
                      {tab === "Pending" &&
                        "Assignments that need your attention."}
                      {tab === "Completed" &&
                        "Assignments you've successfully submitted."}
                      {tab === "Missed" &&
                        "Assignments you didn't submit on time."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Your Score</TableHead>
                          <TableHead>Total Score</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterData(getAssignmentsByStatus(tab)).map((item) => (
                          <TableRowComponent
                            key={item.id}
                            item={item}
                            studentId={userState.user?._id || ""}
                            setAssignments={setAssignments}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
