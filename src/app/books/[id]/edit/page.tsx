"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:8080/api/v1/books";

export default function UpdateBook({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<any>({});

  const validateFields = () => {
    const errors: any = {};

    if (!title || title.length < 1 || title.length > 200) {
      errors.title = "Title must be between 1 and 200 characters";
    }

    if (!author || author.length < 1 || author.length > 100) {
      errors.author = "Author name must be between 1 and 100 characters";
    }

    if (!isbn || !/^[0-9]{13}$/.test(isbn)) {
      errors.isbn = "ISBN must be exactly 13 digits";
    }

    if (!publicationYear || publicationYear < 1700 || publicationYear > 2025) {
      errors.publicationYear = "Publication year must be between 1700 and 2025";
    }

    if (description.length > 1000) {
      errors.description = "Description cannot exceed 1000 characters";
    }

    return errors;
  };

  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        setError("Failed to fetch book data");
        return;
      }
      const data = await response.json();
      setTitle(data.title);
      setAuthor(data.author);
      setIsbn(data.isbn);
      setPublicationYear(data.publicationYear);
      setDescription(data.description);
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedBook = { title, author, isbn, publicationYear, description };

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      router.push(`/books`);
    } catch (err) {
      setError("Failed to update book");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Update Book</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`border p-2 rounded w-full text-black ${validationErrors.title ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm">{validationErrors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`border p-2 rounded w-full text-black ${validationErrors.author ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.author && (
              <p className="text-red-500 text-sm">{validationErrors.author}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className={`border p-2 rounded w-full text-black ${validationErrors.isbn ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.isbn && (
              <p className="text-red-500 text-sm">{validationErrors.isbn}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Publication Year</label>
            <input
              type="number"
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
              className={`border p-2 rounded w-full text-black ${validationErrors.publicationYear ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.publicationYear && (
              <p className="text-red-500 text-sm">{validationErrors.publicationYear}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`border p-2 rounded w-full text-black ${validationErrors.description ? 'border-red-500' : ''}`}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm">{validationErrors.description}</p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
