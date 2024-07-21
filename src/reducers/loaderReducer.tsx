import { LoaderAction } from "@/types";

const initialState = { loading: true };

function loaderReducer(state: typeof initialState, action: LoaderAction) {
  switch (action.type) {
    case "SHOW_LOADER":
      return { loading: true };
    case "HIDE_LOADER":
      return { loading: false };
    default:
      return state;
  }
}

export { loaderReducer, initialState };
