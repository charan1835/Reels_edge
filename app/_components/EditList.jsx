"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import GlobalApi from "../_utils/GlobalApi";
import ReelList from "./ReelList";

export default function EditList() {
  const [edits, setEdits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useSearchParams();
  const selectedCategory = params.get("category");

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      setError(null);
      
      GlobalApi.GetEditsByCategory(selectedCategory)
        .then((res) => {
          // Handle different Hygraph response structures
          let extractedEdits = [];
          
          if (res) {
            extractedEdits = 
              res.edits ||
              res.data?.edits ||
              res.data ||
              res.items ||
              res.results ||
              (Array.isArray(res) ? res : []);
          }
          
          // Ensure we have an array
          if (Array.isArray(extractedEdits)) {
            setEdits(extractedEdits);
          } else if (extractedEdits && typeof extractedEdits === 'object') {
            setEdits([extractedEdits]);
          } else {
            setEdits([]);
          }
          
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch edits");
          setEdits([]);
          setLoading(false);
        });
    } else {
      setEdits([]);
      setError(null);
    }
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="px-4 py-6 flex justify-center items-center">
        <div className="text-white">Loading edits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        {selectedCategory ? `Edits for ${selectedCategory}` : "Select a category"}
      </h2>
      
      <h2 className="text-lg font-semibold mb-4 text-gray-400">
        {edits?.length || 0} Results Found
      </h2>

      <ReelList edits={edits} />
    </div>
  );
}