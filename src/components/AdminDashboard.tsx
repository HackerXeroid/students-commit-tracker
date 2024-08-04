import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { LoaderContext } from "@/contexts/LoaderContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import {
  GetAllTeacherStatus,
  ApproveTeacher,
  RejectTeacher,
} from "@/api/admin";

interface Teacher {
  id: string;
  name: string;
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  dateApplied: string;
}

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const { loaderDispatch } = useContext(LoaderContext);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const getAllTeacherStatus = async () => {
    try {
      const response = await GetAllTeacherStatus();
      return response;
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
      const allTeachersStatus = await getAllTeacherStatus();
      setTeachers(allTeachersStatus);
    })();
    loaderDispatch({ type: "HIDE_LOADER" });
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filterTeachers = (status: Teacher["status"]) => {
    return teachers
      .filter((teacher) => teacher.status === status)
      .filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const handleStatusChange = async (
    teacherId: string,
    newStatus: Teacher["status"]
  ) => {
    try {
      if (newStatus === "Approved") await ApproveTeacher(teacherId);
      if (newStatus === "Rejected") await RejectTeacher(teacherId);

      setTeachers(
        teachers.map((teacher) =>
          teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
        )
      );
    } catch (err) {
      toast({
        title: "Error",
        description: `Something went wrong`,
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  const TeacherDetailsDialog: React.FC<{ teacher: Teacher }> = ({
    teacher,
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={teacher.name}
              className="col-span-3 focus-visible:ring-0 focus-visible:ring-transparent"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={teacher.email}
              className="col-span-3 focus-visible:ring-0 focus-visible:ring-transparent"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Input
              id="status"
              value={teacher.status}
              className="col-span-3 focus-visible:ring-0 focus-visible:ring-transparent"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateApplied" className="text-right">
              Date Applied
            </Label>
            <Input
              id="dateApplied"
              value={new Date(teacher.dateApplied).toLocaleString()}
              className="col-span-3 focus-visible:ring-0 focus-visible:ring-transparent"
              readOnly
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => handleStatusChange(teacher.id, "Approved")}
            disabled={teacher.status === "Approved"}
          >
            Approve
          </Button>
          <Button
            onClick={() => handleStatusChange(teacher.id, "Rejected")}
            disabled={teacher.status === "Rejected"}
            variant="destructive"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex w-full flex-col bg-muted/40 pt-4 mt-10">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        <Input
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          {(["Pending", "Approved", "Rejected"] as const).map((tab) => (
            <TabsContent value={tab.toLowerCase()} key={tab}>
              <Card>
                <CardHeader>
                  <CardTitle>{tab} Teacher Applications</CardTitle>
                  <CardDescription>
                    Manage teacher authorizations here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterTeachers(tab).map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>{teacher.name}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                teacher.status === "Approved"
                                  ? "secondary"
                                  : teacher.status === "Pending"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {teacher.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(teacher.dateApplied).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <TeacherDetailsDialog teacher={teacher} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
