import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold heading-font text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="btn-primary px-8 py-3 rounded-xl font-semibold inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
