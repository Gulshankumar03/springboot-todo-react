import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

const inputVariants = {
  focus: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.95 },
};

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      const success = await auth.signup(username, password);
      if (success) {
        navigate("/login");
      } else {
        setMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center flex-col justify-center min-h-[90vh] p-4">
      <Card className="w-[400px] bg-white shadow-xl overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Sign up
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 py-3 flex-grow">
            <div className="space-y-0">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                whileHover="hover"
              >
                <Input
                  autoFocus
                  autoComplete="true"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            </div>

            <div className="space-y-0">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                whileHover="hover"
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col pt-8 pb-6 mt-auto">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full"
            >
              <Button
                onClick={handleSubmit}
                type="submit"
                className="w-full text-white font-normal py-2 px-4 rounded-md duration-100"
              >
                Sign up
              </Button>
            </motion.div>

            <p className="text-xs mt-5 text-gray-800 self-start">
              Already have an account?
              <span>
                {" "}
                <Link to={`/login`} className="text-blue-800">
                  Login
                </Link>
              </span>
            </p>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 text-sm text-center text-gray-600"
              >
                {message}
              </motion.p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
