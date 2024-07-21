import { UserAction, UserOrNull } from "@/types";
const initialState: { user: UserOrNull } = { user: null };

const userReducer = (state: typeof initialState, action: UserAction) => {
  switch (action.type) {
    case "LOGIN_USER":
      return { user: action.payload };
    case "LOGOUT_USER":
      return { user: null };
    default:
      return state;
  }
};

export { userReducer, initialState };
