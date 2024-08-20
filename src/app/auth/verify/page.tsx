"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const VerifyPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (res.ok) {
        setTimeout(() => {
          toast.success("Account verified successfully!");
        }, 2000);
        router.push("/auth/signin");
      } else {
        setError(data.error || "Invalid verification code.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Verify Your Account
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Enter your verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className={`w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ${
            isLoading ? "bg-blue-400 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyPage;
