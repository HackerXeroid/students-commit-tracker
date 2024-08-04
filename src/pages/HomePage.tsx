import StudentDashboard from "@/components/StudentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import PendingTeacherView from "@/components/PendingTeacherView";
import RejectedTeacherView from "@/components/RejectedTeacherView";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

function HomePage() {
  const { userState } = useContext(UserContext);

  return (
    <div className="">
      {userState.user?.role === "student" && <StudentDashboard />}
      {userState.user?.role === "teacher" && <TeacherDashboard />}
      {userState.user?.role === "teacher_pending" && <PendingTeacherView />}
      {userState.user?.role === "teacher_rejected" && <RejectedTeacherView />}
      {userState.user?.role === "admin" && <AdminDashboard />}
    </div>
  );
}

export default HomePage;
