import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect } from "react";
import LeaderboardContent from "@/pages/Leaderboard/LeaderboardContent";

function LeaderboardPage() {
  const { userState, userDispatch } = useContext(UserContext);

  useEffect(() => {
    if (!userState.user) {
      userDispatch({
        type: "LOGIN_USER",
        payload: JSON.parse(sessionStorage.getItem("user")!),
      });
    }
  }, []);

  return (
    <div className="pt-14">
      <div className="px-10 mt-10">
        <div className="flex gap-4 justify-end"></div>
        <LeaderboardContent />
      </div>
    </div>
  );
}

export default LeaderboardPage;
