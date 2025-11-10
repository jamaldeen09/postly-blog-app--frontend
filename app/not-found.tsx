// app/not-found.tsx
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Page not found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go back
        </Link>
      </div>
    </div>
  );
};

export default NotFound;