import { initialState, loaderReducer } from "@/reducers/loaderReducer";
import { LoaderAction, WrapperComponentProps } from "@/types";
import { createContext, useReducer } from "react";

type LoaderContextProps = {
  loaderState: typeof initialState;
  loaderDispatch: React.Dispatch<LoaderAction>;
};

const LoaderContext = createContext<LoaderContextProps>({
  loaderState: initialState,
  loaderDispatch: () => {},
});

const LoaderProvider: React.FC<WrapperComponentProps> = ({ children }) => {
  const [loaderState, loaderDispatch] = useReducer(loaderReducer, initialState);

  return (
    <LoaderContext.Provider value={{ loaderState, loaderDispatch }}>
      {children}
    </LoaderContext.Provider>
  );
};

export { LoaderContext, LoaderProvider };
