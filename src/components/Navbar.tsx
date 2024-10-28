import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function Navbar() {
  const authContext = useAuth();

  const logout = () => {
    authContext?.logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0  bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={`/`} className=" text-[28px] font-bold font-nunito">
              Todo
            </Link>
            <Link
              to={`/`}
              className=" text-[28px] font-extrabold font-nunito text-indigo-600"
            >
              List
            </Link>
            {authContext?.isAuthenticated && (
              <Link
                className="bg-slate-200/30 hover:bg-slate-200 ml-5 px-4 py-2 rounded-md"
                to={"/todos"}
              >
                My Todos
              </Link>
            )}
          </div>

          <div className="flex gap-1">
            {authContext?.isAuthenticated && (
              <Link
                className="hover:bg-slate-200/70 px-4 py-2 rounded-md"
                to={"/welcome"}
              >
                Home
              </Link>
            )}
            <Link
              className="hover:bg-slate-200/70 px-4 py-2 rounded-md"
              to={"/signup"}
            >
              Sign Up
            </Link>
            <Link
              className="hover:bg-slate-200/70 px-4 py-2 rounded-md"
              to={"/signin"}
            >
              Login
            </Link>
            {authContext?.isAuthenticated && (
              <Link
                className="hover:bg-slate-200/70 px-4 py-2 rounded-md"
                to={"/signin"}
                onClick={logout}
              >
                Logout
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
