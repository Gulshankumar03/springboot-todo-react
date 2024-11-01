import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./security/AuthContext";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";
import logo from "../assets/check-list.png";

const Navbar: React.FC = () => {
  const authContext = useAuth();
  const location = useLocation();

  const logout = () => {
    if (authContext) {
      authContext.logout();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-6 w-6 mr-2" />
            </Link>
            <Link to="/" className={`text-[28px] font-bold font-nunito `}>
              Todo
            </Link>
            <Link
              to="/"
              className={`pr-4 text-[28px] font-extrabold font-nunito text-orange-500`}
            >
              List
            </Link>
            {authContext?.isAuthenticated && (
              <>
                <div className="flex gap-2">
                  <Link
                    className={`hover:bg-orange-200/70 px-3 py-2 rounded-md ${
                      isActive("/welcome") ? " bg-gray-200" : ""
                    }`}
                    to="/welcome"
                  >
                    Home
                  </Link>
                  <Link
                    className={`hover:bg-orange-200/70 px-3 py-2 rounded-md ${
                      isActive("/todos") ? "bg-gray-200" : ""
                    }`}
                    to="/todos"
                  >
                    Todos
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {authContext?.isAuthenticated ? (
              <Link
                className="transform transition-transform duration-200 hover:scale-105"
                to="/signin"
                onClick={logout}
              >
                <Button>
                  Logout <LogOutIcon />
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  className="transform transition-transform duration-200 hover:scale-105"
                  to="/signup"
                >
                  <Button variant={"outline"}>
                    Sign up 
                  </Button>
                </Link>

                <Link
                  className="transform transition-transform duration-200 hover:scale-105"
                  to="/signin"
                >
                  <Button>
                    Login <LogInIcon />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
