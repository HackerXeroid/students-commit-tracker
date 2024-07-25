import StudentDashboard from "@/components/StudentDashboard";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

function HomePage() {
  const { userState } = useContext(UserContext);

  return (
    <div className="">
      {userState.user?.role === "student" && <StudentDashboard />}
      {userState.user?.role !== "student" && "Soon"}
    </div>
  );
}

export default HomePage;
