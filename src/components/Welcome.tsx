import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center min-h-[93vh] bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800">
      {/* Hero Section */}
      <div className="text-center max-w-3xl p-16 mt-48  bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Welcome to Task<span className="font-nunito text-orange-500">Mate!</span>
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          Streamline your tasks, prioritize effectively, and achieve your goals
          with a simple and intuitive todo management experience.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          Manage Todos
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
