"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const BASE_URL = "http://localhost:8080/api/v1/books";

const BookDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${BASE_URL}/${id}`)
        .then((response) => response.json())
        .then((data) => setBook(data))
        .catch((error) => console.error("Failed to fetch book:", error));
    }
  }, [id]);

  const fetchAiInsights = async () => {
    if (!book) return;

    setLoadingInsights(true);
    setAiInsights(null);

    try {
        const response = await fetch(`${BASE_URL}/${id}/ai-insights`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Unknown error occurred";

            setAiInsights(errorMessage); 
            return;
        }

        const data = await response.json(); 
        const aiInsightObj = JSON.parse(data.aiInsight);
    
        const aiContent = aiInsightObj.message.content;
        setAiInsights(aiContent.trim()); 
    } catch (error) {
        setAiInsights("Could not generate insights at the moment.");
    } finally {
        setLoadingInsights(false);  
    }
};

  if (!book) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Book Details</h1>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Title: {book.title}</h2>
          <p className="text-gray-700">Author: {book.author}</p>
          <p className="text-gray-500">Published: {book.publicationYear}</p>
          <p className="text-gray-600 mt-4">{book.description}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => router.push("/books")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={fetchAiInsights}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loadingInsights}
          >
            {loadingInsights ? "Generating..." : "Get AI Insights"}
          </button>
        </div>

        {aiInsights && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-100">
           <h3 className="text-xl font-semibold mb-2 text-gray-800">AI Insights</h3>
            <p className="text-gray-700">{aiInsights}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
