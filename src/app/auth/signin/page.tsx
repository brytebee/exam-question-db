"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        setTimeout(() => {
          toast.success("Sign in successfully!");
        }, 2000);
        router.push("/exam/add-exam");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md space-y-4  text-black"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className={`w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ${
            isLoading ? "bg-blue-400 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={() => signIn("google")}
          className="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          Sign in with Google
        </button>
      </div>
      <p className="mt-4 text-gray-600">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default SignInPage;
