
import { createContext } from "react";

export interface AuthContextType {
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  isLoading: boolean;
  userRole: string | null;
  isAuthenticated: boolean;
}

// Default Auth Context with mocked user data since authentication is bypassed
const AuthContext = createContext<AuthContextType>({
  user: { 
    id: '1',
    email: 'user@example.com',
    role: 'admin' 
  },
  isLoading: false,
  userRole: 'admin',
  isAuthenticated: true
});

export default AuthContext;
