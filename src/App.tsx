import React, { ReactNode } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import TodosComponent from "./components/TodosComponent";
import { Toaster } from "./components/ui/toaster";
import AuthProvider, { useAuth } from "./components/security/AuthContext";
import Login from "./components/Login";
import Welcome from "./components/Welcome";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const authContext = useAuth();

  if (authContext?.isAuthenticated) {
    return children;
  }

  return <Navigate to={"/login"} />; //If user is not authenticated and tries to visit the protected route then redirect (navigate) to "/"
}

const App: React.FC = () => {
  return (
    <div className="h-screen">
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* <Route
                path="/welcome"
                element={
                  <AuthenticatedRoute>
                    <Welcome />
                  </AuthenticatedRoute>
                }
              /> */}

              {/* <Route
                path="/welcome"
                element={
                  <AuthenticatedRoute>
                    <TodoList />
                  </AuthenticatedRoute>
                } 
              />*/}

              <Route
                path="/todos"
                element={
                  <AuthenticatedRoute>
                    <TodosComponent />
                  </AuthenticatedRoute>
                }
              />

              {/* <Route path="*" element={<ErrorComponent />} /> */}
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
