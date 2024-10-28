import { Button } from "@/components/ui/button";
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
              className=" text-[28px] font-extrabold font-nunito text-orange-500"
            >
              List
            </Link>
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              className="text-base bg-slate-400/10 hover:bg-slate-200/70"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
