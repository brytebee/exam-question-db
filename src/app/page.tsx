"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ redirect: false });
    // No need to redirect as the page will refresh or redirect automatically
    setIsSigningOut(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.stockcake.com/public/1/1/8/11856380-28c0-40f5-9499-4032108946ba/students-studying-together-stockcake.jpg')",
      }}
    >
      <div className="bg-[#756969] bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full text-center text-white">
        <h1 className="text-4xl font-bold mb-6">Exam Question DB</h1>

        {/* User Status Section */}
        {status === "authenticated" && session?.user && (
          <div className="mb-4 p-2 bg-gray-700 bg-opacity-30 rounded-lg">
            <p className="text-sm">
              Signed in as:{" "}
              <span className="font-semibold">
                {session.user.name || session.user.email}
              </span>
            </p>
          </div>
        )}

        <p className="text-lg mb-6">
          Welcome to the exam question database. Choose an option below to
          manage your questions.
        </p>

        <div className="flex flex-col space-y-4">
          {status === "authenticated" ? (
            <>
              <Link
                href="/exam/add-exam"
                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
                aria-label="Add a new exam"
              >
                Add New Exam
              </Link>
              <Link
                href="/exam/view-exams"
                className="bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-colors"
                aria-label="View existing exams"
              >
                View Exams
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`bg-red-500 text-white p-3 rounded transition-colors ${
                  isSigningOut
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
                aria-label="Sign out of your account"
              >
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            </>
          ) : status === "loading" ? (
            <div className="flex justify-center p-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 transition-colors"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Quick Info Section */}
        {status === "authenticated" && (
          <div className="mt-8 text-sm text-gray-200 bg-gray-700 bg-opacity-30 p-3 rounded-lg">
            <h2 className="font-semibold mb-2">Quick Guide</h2>
            <ul className="text-left space-y-1 list-disc list-inside">
              <li>Add new exams with custom questions</li>
              <li>View and manage your existing question sets</li>
              <li>Generate printable exam papers</li>
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-300">
          <p>© {new Date().getFullYear()} Exam Question DB</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-white transition-colors">
              Help
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
