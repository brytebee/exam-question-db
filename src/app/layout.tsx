import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider"; // Import the ClientProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exam Questions",
  description: "Create dynamic questions for your learning systems.",
  authors: [
    {
      name: "Bright Atsighi",
      url: "https://linkedin.com/in/brytebee",
    },
  ],
  keywords: [
    "Exam",
    "Test",
    "Quiz",
    "Assessment",
    "Education",
    "EdTech",
    "School",
  ],
  openGraph: {
    title: "Exam Questions",
    description: "Create dynamic questions for your learning systems.",
    authors: "Bright Atsighi",
    images: [
      "https://res.cloudinary.com/dprkvmhld/image/upload/v1724060501/exam-question-db_bki737.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          {" "}
          {/* Use the ClientProvider here */}
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
