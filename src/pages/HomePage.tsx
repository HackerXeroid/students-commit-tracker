import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { userState, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    userDispatch({ type: "LOGOUT_USER" });
    toast({
      variant: "default",
      title: "Success",
      description: "Logged out successfully",
      duration: 1500,
    });
    navigate("/login");
  };

  console.log("From home page", userState?.user);
  return (
    <div>
      <p>User: {userState?.user?.name}</p>
      <Button onClick={logoutHandler}>Logout</Button>
    </div>
  );
}

export default HomePage;
