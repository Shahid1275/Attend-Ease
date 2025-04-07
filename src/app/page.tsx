"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://192.168.50.218/laravel-project/attendance-system/public/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_type: loginInput, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const responseData = await response.json();
      const data = responseData.data;
      const token = data.token || data.access_token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      const username = data.user?.name || data.user?.username || loginInput;
      localStorage.setItem("username", username);

      router.push("/dashboard?welcome=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Image Section */}
      <div className="hidden md:flex md:w-1/2 relative">
        <Image
          src="/6310507.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="rounded-r-lg"
        />
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-white shadow-xl">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-4">
            Welcome Back
          </h1>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Username / Email
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter username or email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 sm:p-2.5 rounded-lg font-semibold hover:bg-blue-600 transition text-sm sm:text-base"
            >
              Log In
            </button>
          </form>
          <div className=" space-y-2">
            <p className="text-blue-500 text-sm font-medium text-start cursor-pointer">Admin?</p>
            <p className="text-gray-600 text-xs sm:text-sm text-start">
              If you are not a user, you are not welcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}