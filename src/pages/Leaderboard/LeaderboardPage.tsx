import { UserContext } from "@/contexts/UserContext";
import { avatarUrl } from "@/utils/avatarUtils";
import { useContext, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="">
      <div className="flex items-center justify-end px-10 py-2 bg-gray-100 border-b border mb-10">
        <Avatar className="border border-gray-300 mr-2">
          <AvatarImage
            src={avatarUrl(userState.user ? userState.user?.id : null)}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="small-caps font-medium text-xl">
          {userState.user ? userState.user?.name.split(" ")[0] : "Anonymous"}
        </p>
      </div>
      <div className="px-10">
        <div className="flex gap-4 justify-end"></div>
        <LeaderboardContent />
      </div>
    </div>
  );
}

export default LeaderboardPage;
