import { UserContext } from "@/contexts/UserContext";
import { useContext, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarUrl } from "@/utils/avatarUtils";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, School, GraduationCap, ShieldCheck } from "lucide-react";
import { useToast } from "./ui/use-toast";

function NavBar() {
  const { userState, userDispatch } = useContext(UserContext);
  console.log(userState?.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.removeProperty("pointer-events");
      document.body.removeAttribute("data-scroll-locked");
    }
  }, [open]);

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

  const showNavBar = ["/", "/leaderboard"].includes(location.pathname);

  if (!showNavBar) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher":
        return <School className="mr-2 h-4 w-4" />;
      case "student":
        return <GraduationCap className="mr-2 h-4 w-4" />;
      case "admin":
        return <ShieldCheck className="mr-2 h-4 w-4" />;
      default:
        return <User className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <nav className="flex justify-end items-center p-4 fixed top-0 left-0 right-0">
      {userState.user && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={avatarUrl(`${userState.user.id} ${userState.user.email}`)}
              />
              <AvatarFallback>
                {userState.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userState.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userState.user.email}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  {getRoleIcon(userState.user.role)}
                  <span className="capitalize">{userState.user.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
}

export default NavBar;
