"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Menu, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const SignInButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignInButton), { ssr: false });
const SignUpButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignUpButton), { ssr: false });
const UserButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.UserButton), { ssr: false });

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Upload", href: "/upload" },
  { name: "Explore", href: "/explore" },
  { name: "About", href: "/about" },
  { name: "Connect", href: "/connect" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg text-white shadow-md transition-all duration-300 ease-out">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="text-2xl font-bold tracking-wider">
          Reel<span className="text-pink-500">Edge</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-pink-400 transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex gap-3 ml-4">
              <SignInButton mode="modal">
                <button className="px-4 py-1 border border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none transition-all duration-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 transition-all duration-300 ease-in-out">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-lg hover:text-pink-400"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <hr className="border-pink-400 my-2" />

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex flex-col gap-2">
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2 border border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
