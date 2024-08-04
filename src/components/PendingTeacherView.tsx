import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PendingTeacherView: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
      <Card className="min-w-96 max-w-xl">
        <CardHeader>
          <CardTitle>Waiting for Approval</CardTitle>
          <CardDescription>
            Your account is pending authorization
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <p className="">
            Thank you for registering as a teacher.
            <br /> Our admin team is currently reviewing your application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingTeacherView;
