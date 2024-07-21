import { useReducer, createContext, Dispatch } from "react";
import { userReducer, initialState } from "@/reducers/userReducer";
import { ProviderProps, UserAction } from "@/types";

interface UserContextProps {
  userState: typeof initialState;
  userDispatch: Dispatch<UserAction>;
}

const UserContext = createContext<UserContextProps>({
  userState: initialState,
  userDispatch: () => {},
});

const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
