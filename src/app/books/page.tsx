"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  publicationYear: number;
}

const BASE_URL = "http://localhost:8080/api/v1/books";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [titleQuery, setTitleQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const router = useRouter();

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const searchParams = new URLSearchParams();
      if (titleQuery) searchParams.append("title", titleQuery);
      if (authorQuery) searchParams.append("author", authorQuery);

      const url = searchParams.toString()
        ? `${BASE_URL}/search?${searchParams.toString()}`
        : BASE_URL;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("No books found");
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setBooks([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchClicked(true);
    fetchBooks();
  };

  const clearSearch = () => {
    setTitleQuery("");
    setAuthorQuery("");
    setIsSearchClicked(false);
    fetchBooks();
  };

  const handleCreateBookClick = () => {
    router.push("/create-book");
  };

  const handleDeleteBook = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      fetchBooks();
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  useEffect(() => {
    if (isSearchClicked) {
      fetchBooks();
    }
  }, [isSearchClicked]);

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Books List</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3 text-black"
          />
          <input
            type="text"
            placeholder="Search by author..."
            value={authorQuery}
            onChange={(e) => setAuthorQuery(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3 text-black"
          />
          <button
            onClick={handleSearchClick}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-1/6"
          >
            Search
          </button>
          <button
            onClick={clearSearch}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-1/6"
          >
            Clear
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && books.length === 0 && !error && (
          <p className="text-gray-500 text-center mt-4">No books found.</p>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {books.map((book) => (
            <li key={book.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-700">By {book.author}</p>
              <p className="text-gray-500">Published: {book.publicationYear}</p>

              <div className="mt-4 flex justify-between">
                <Link href={`/books/${book.id}/book-detail`} className="text-blue-500">
                  View Details →
                </Link>
                <button
                  onClick={() => router.push(`/books/${book.id}/edit`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleCreateBookClick}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Create New Book
          </button>
        </div>
      </div>
    </div>
  );
}
