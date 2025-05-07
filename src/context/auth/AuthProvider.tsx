
import React, { ReactNode } from "react";
import AuthContext from "./AuthContext";
import { useMockAuth } from "./mockAuth";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  console.log("AuthProvider rendering with mock auth");
  
  // Use the mock auth implementation
  const authValues = useMockAuth();

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
}
