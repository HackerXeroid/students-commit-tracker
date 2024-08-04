import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterUser } from "@/api/user";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { UserContext } from "@/contexts/UserContext";

import RadioGroup from "@/components/RadioGroup";

function RegisterPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);
  useEffect(() => {
    if (userState?.user) {
      navigate("/");
    }
  }, []);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const teacher = form.elements.namedItem("teacher") as HTMLInputElement;

    let role: "student" | "teacher_pending" = "student";
    if (teacher.ariaChecked === "true") role = "teacher_pending";

    try {
      const res = await RegisterUser({ name, email, password, role });

      if (res.success) {
        toast({
          variant: "default",
          title: "Success",
          description: "Account created successfully",
          duration: 1500,
        });

        localStorage.setItem("token", res.token);
        navigate("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      let errorMessage;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else errorMessage = "Something went wrong";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        duration: 1500,
      });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Max Robinson" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="abc@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
              <RadioGroup />
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
