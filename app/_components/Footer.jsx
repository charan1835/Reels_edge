"use client"
import React from "react"
import { FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10 border-t border-gray-800 ">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left: Brand Info */}
        <div className="text-center md:text-left">
          <h2 className="text-white text-2xl font-bold mb-2">ReelEdge 🎬</h2>
          <p className="text-sm text-gray-500">Crafting stories through edits. Insta, YouTube, Weddings & more.</p>
        </div>

        {/* Middle: Nav Links */}
        <div className="flex flex-wrap gap-6 justify-center">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/connect" className="hover:text-white transition">Connect</Link>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4 justify-center">
          <a href="https://www.instagram.com/c.charan.19/?__pwa=1" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 text-xl">
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 text-xl">
            <FaYoutube />
          </a>
          <a href="mailto:chimmbilicharan@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 text-xl">
            <FaEnvelope />
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-sm text-gray-600 mt-8">
        © {new Date().getFullYear()} ReelEdge. All rights reserved.
      </div>
    </footer>
  )
}
