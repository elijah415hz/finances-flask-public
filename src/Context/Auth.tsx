import React, { createContext, useContext, useReducer } from "react";
import { Auth, AuthContextType } from "../interfaces/Interfaces";

const AuthContext = createContext<AuthContextType>({
  Auth: {
    loggedIn: false,
    user: "",
    token: "",
  },
  setAuth: (): void => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: { children: React.ReactNode }) {
  // Reducer state for Authentication values
  const reducer = (
    state: Auth,
    action: { type: string; payload?: { user: string; token: string } }
  ): Auth => {
    if (action.type === "LOGIN" && action.payload) {
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    } else if (action.type === "LOGOUT") {
      localStorage.clear();
      return {
        ...state,
        loggedIn: false,
        user: "",
        token: "",
      };
    } else {
      return state;
    }
  };

  const [Auth, setAuth] = useReducer(reducer, {
    loggedIn: false,
    user: "",
    token: "",
  });

  const value = {
    Auth,
    setAuth,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
