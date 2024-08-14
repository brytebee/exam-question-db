import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.stockcake.com/public/1/1/8/11856380-28c0-40f5-9499-4032108946ba/students-studying-together-stockcake.jpg')",
      }}
    >
      <div className="bg-[#756969] bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Exam Question DB</h1>
        <p className="text-lg mb-4">
          Welcome to the exam question database. Choose an option below to
          manage your questions.
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/add-exam"
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Add New Exam
          </Link>
          <Link
            href="/view-questions"
            className="bg-green-500 text-white p-3 rounded hover:bg-green-600"
          >
            View Questions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
