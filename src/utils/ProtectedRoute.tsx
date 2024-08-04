import { WrapperComponentProps } from "@/types";
import { LoaderContext } from "@/contexts/LoaderContext";
import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { GetCurrentUser } from "@/api/user";
import { useToast } from "@/components/ui/use-toast";

function ProtectedRoute({ children }: WrapperComponentProps) {
  const { loaderState, loaderDispatch } = useContext(LoaderContext);
  const { userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getCurrentUser = async () => {
    if (sessionStorage.getItem("user")) {
      loaderDispatch({
        type: "HIDE_LOADER",
      });
      userDispatch({
        type: "LOGIN_USER",
        payload: JSON.parse(sessionStorage.getItem("user")!),
      });
      return JSON.parse(sessionStorage.getItem("user")!);
    }

    try {
      loaderDispatch({
        type: "SHOW_LOADER",
      });

      const response = await GetCurrentUser();
      if (response.data.role === "student" || response.data.role === "teacher")
        sessionStorage.setItem("user", JSON.stringify(response.data));
      userDispatch({ type: "LOGIN_USER", payload: response.data });
      toast({
        variant: "default",
        title: "Success",
        description: "User fetched",
        duration: 1500,
      });

      return response.data;
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

      navigate("/login");
    } finally {
      loaderDispatch({ type: "HIDE_LOADER" });
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");

    (async () => await getCurrentUser())();
  }, []);

  if (loaderState.loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
