import React from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  role: "student" | "teacher";
}

export type UserOrNull = User | null;

export interface AssignmentSubmission {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  assignment: string;
  submissionDate: string;
  githubLink: string;
  score: number;
  feedback: string;
  rank: number;
}

export interface DateTagProps {
  onSelectDate: (date: Date) => void;
  onButtonClick: () => void;
  buttonText: string;
}

// ACTIONS
export interface LoginUserAction {
  type: "LOGIN_USER";
  payload: User;
}

export interface LogoutUserAction {
  type: "LOGOUT_USER";
}

export type UserAction = LoginUserAction | LogoutUserAction;

export type LoaderAction = { type: "SHOW_LOADER" } | { type: "HIDE_LOADER" };

// PROVIDERS
export interface ProviderProps {
  children: React.ReactNode;
}

// CONTEXTS

// COMPONENT PROPS

// GENERIC COMPONENTS PROPS
export interface WrapperComponentProps {
  children: React.ReactNode;
}
