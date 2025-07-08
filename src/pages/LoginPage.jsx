import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Image */}
        <div className="w-full h-60 rounded-xl bg-gradient-to-r from-gray-600 to-gray-300 shadow-md" />

        {/* Welcome Text */}
        <h2 className="text-center text-2xl font-bold text-gray-900">Welcome back</h2>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
          >
            Log in
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
