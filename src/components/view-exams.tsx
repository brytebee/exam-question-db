"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "@/commons/Spinner-mui";

interface ExamInfo {
  id: string;
  exam: string;
  subject: string;
  year: number;
}

const ViewExams: React.FC = () => {
  const { data: session, status } = useSession();
  // @ts-ignore
  const id = session?.user?.id!;
  // @ts-ignore
  const role = session?.user?.role!;

  const router = useRouter();
  const [examInfoList, setExamInfoList] = useState<ExamInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      setLoading(true);

      (async () => await fetchExamInfo())();
    }
  }, [currentPage]);

  const fetchExamInfo = async () => {
    try {
      const response = await fetch(
        // @ts-ignore
        `/api/exams?page=${currentPage}&userId=${id}&role=${role}`
      );
      const data = await response.json();
      setExamInfoList(data.exams);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching exam info:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = () => (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 mr-2 min-w-24"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 ml-2 min-w-24"
      >
        Next
      </button>
    </div>
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4 relative"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/006/240/296/small_2x/idyllic-mountain-landscape-with-fresh-green-meadows-and-blooming-wildflowers-idyllic-nature-countryside-view-rural-outdoor-natural-view-idyllic-banner-nature-panoramic-spring-summer-scenery-photo.jpg')",
      }}
    >
      {loading && <Spinner text="Loading exams!" />}
      {/* {loading && <Spinner />} */}

      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 py-12 relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">
          Exam Information
        </h1>

        {examInfoList?.length > 0 ? (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {examInfoList.map((examInfo) => (
              <div
                key={examInfo.id}
                className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="font-medium text-lg text-gray-700">
                  {examInfo.exam} - {examInfo.subject} ({examInfo.year})
                </p>
                <Link
                  href={`/exam/view-exams/${examInfo.id}`}
                  className="mt-2 inline-block bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                >
                  View Questions
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl text-red-600 mb-6">
            No exam information available.
          </p>
        )}

        {renderPagination()}

        <div className="mt-6">
          <Link
            href="/exam/add-exam"
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 w-full text-center block"
          >
            Add New Exam
          </Link>
          <br />
          <a
            href="/"
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 text-center block"
          >
            Home Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default ViewExams;
