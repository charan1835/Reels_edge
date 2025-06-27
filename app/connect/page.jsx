"use client"

import React from "react"
import Link from "next/link"

export default function Connect() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Intro */}
        <h1 className="text-4xl font-bold text-center mb-4">Let’s Connect 💬</h1>
        <p className="text-lg text-gray-400 text-center mb-10">
          Whether you're vibing with our edits or have a dream project in mind, drop us a message below. We'll hit you back ASAP 🚀
        </p>

        {/* Why Reach Out Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">📽️ Project Inquiry</h3>
            <p className="text-gray-400 text-sm">Want to get an edit done? Share your idea, and we’ll craft it.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">🤝 Collab Request</h3>
            <p className="text-gray-400 text-sm">Creator? Let’s cook up something wild together.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">💬 Just Saying Hi</h3>
            <p className="text-gray-400 text-sm">Even if it’s just to say “yo,” we’re here for it.</p>
          </div>
        </div>

        {/* Embedded Google Form */}
        <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSePOh5me7-zlzlmZHSrBMmlUt5BCycdnDltpAYoLihdTs19GQ/viewform?embedded=true"
            width="100%"    
            height="800"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="w-full h-[800px]"
            title="ReelEdge Contact Form"
          >
            Loading…
          </iframe>
        </div>

        {/* Go Back or CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
