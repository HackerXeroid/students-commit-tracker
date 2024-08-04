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
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoginUser } from "@/api/user";
import { UserContext } from "@/contexts/UserContext";

function LoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        .value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;

      const res = await LoginUser({ email, password });
      localStorage.setItem("token", res.token);

      toast({
        variant: "default",
        title: "Success",
        description: "Logged in successfully",
        duration: 1500,
      });
      navigate("/");
    } catch (err) {
      let errorMessage;
      if (err instanceof Error) {
        console.log(err.message);
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

  useEffect(() => {
    if (userState?.user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
