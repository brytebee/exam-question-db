import Link from "next/link";

const ViewQuestionsPage: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/006/240/296/small_2x/idyllic-mountain-landscape-with-fresh-green-meadows-and-blooming-wildflowers-idyllic-nature-countryside-view-rural-outdoor-natural-view-idyllic-banner-nature-panoramic-spring-summer-scenery-photo.jpg')",
      }}
    >
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">
          View Questions
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Here you can review and manage your exam questions.
        </p>
        {/* Add your content and functionality here */}
        <Link
          href="/"
          className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ViewQuestionsPage;
