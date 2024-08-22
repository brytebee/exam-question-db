"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
      <ToastContainer />
    </SessionProvider>
  );
};

export default ClientProvider;
