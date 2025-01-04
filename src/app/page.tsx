"use client";

import Link from "next/link";

export default function Home() {

  return (
    <div className="bg-blue-600 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Solace Advocates</h1>
        <p className="text-lg mb-8">
          Find the best advocates to meet your needs.
        </p>
        <Link
          href="/search"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          Go to Search
        </Link>
      </div>
    </div>
  );
}
