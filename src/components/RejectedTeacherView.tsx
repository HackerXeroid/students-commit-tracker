import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteUser } from "@/api/user";
import { useToast } from "@/components/ui/use-toast";
import { UserContext } from "@/contexts/UserContext";

const RejectedTeacherView: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userDispatch } = useContext(UserContext);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await DeleteUser();
      userDispatch({ type: "LOGOUT_USER" });
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/login");
      toast({
        variant: "default",
        title: "Success",
        description: "Deletion Successful!",
        duration: 1500,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to delete user.",
        duration: 1500,
      });
    }
    // Implement account deletion logic here
    // After deletion is complete:
    // setIsDeleting(false);
    // Redirect user or show confirmation
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
      <Card className="min-w-96 max-w-xl">
        <CardHeader>
          <CardTitle>Application Not Approved</CardTitle>
          <CardDescription>
            We're sorry, but your teacher account application was not approved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Unfortunately, we were unable to approve your application to become
            a teacher on our platform.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RejectedTeacherView;
