"use client";

import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  publicationYear: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/books")
      .then((res) => {
        if (!res.ok) {
          console.log("res: error", res)
          throw new Error("Failed to fetch books");
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Books List</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <li key={book.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-700">By {book.author}</p>
            <p className="text-gray-500">Published: {book.publicationYear}</p>
            <a
              href={`/book/${book.id}`}
              className="text-blue-500 mt-2 inline-block"
            >
              View Details →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
