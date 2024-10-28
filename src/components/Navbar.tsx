import { Link } from "react-router-dom";

export default function Navbar() {
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
          </div>

          <div className="flex gap-1">
            <Link className="hover:bg-gray-100 px-2 py-1 rounded-md" to={"/welcome"}>
              Home
            </Link>
            <Link className="hover:bg-gray-100 px-2 py-1 rounded-md" to={"/signup"}>
              Sign Up
            </Link>
            <Link className="hover:bg-gray-100 px-2 py-1 rounded-md" to={"/signin"}>
              Login
            </Link>
            <Link className="hover:bg-gray-100 px-2 py-1 rounded-md" to={"/signin"}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
