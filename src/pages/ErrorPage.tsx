import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-600">Oops! Page not found.</p>

      <Link to="/" className="mt-4 text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
