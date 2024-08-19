import Link from "next/link";

const ConfirmationPage = () => (
  <div
    className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
    style={{
      backgroundImage:
        "url('https://static.vecteezy.com/system/resources/thumbnails/006/240/296/small_2x/idyllic-mountain-landscape-with-fresh-green-meadows-and-blooming-wildflowers-idyllic-nature-countryside-view-rural-outdoor-natural-view-idyllic-banner-nature-panoramic-spring-summer-scenery-photo.jpg')",
    }}
  >
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">
        Submission Successful
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Your questions have been submitted successfully.
      </p>
      <div className="space-y-4">
        <Link
          href="/"
          className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 block"
        >
          Back to Home
        </Link>
        <Link
          href="/add-exam"
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 block"
        >
          Add Another Exam
        </Link>
      </div>
    </div>
  </div>
);

export default ConfirmationPage;
