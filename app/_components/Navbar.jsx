"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Menu, X, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const SignInButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignInButton), { ssr: false });
const SignUpButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignUpButton), { ssr: false });
const UserButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.UserButton), { ssr: false });

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Upload", href: "/upload" },
  { name: "Profile", href: "/profile" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <nav
        className={`
          fixed top-0 w-full z-50 transition-all duration-300 border-b
          ${scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 py-3"
            : "bg-transparent border-transparent py-5"
          }
        `}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg opacity-80"></div>
              <div className="absolute inset-0 bg-white dark:bg-black rounded-xl border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center z-10">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reel<span className="text-blue-600 dark:text-blue-500">Edge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${isActive
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <ThemeToggle />

              {isLoaded && (
                isSignedIn ? (
                  <div className="flex items-center gap-4">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9 border-2 border-slate-200 dark:border-slate-800"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <SignInButton mode="modal">
                      <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2 text-slate-800 dark:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-2xl transition-all duration-500 ease-in-out md:hidden
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}
        `}
      >
        <div className="flex flex-col h-full pt-28 px-6 pb-10">
          <div className="flex flex-col gap-2">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center justify-between p-4 text-2xl font-bold border-b border-slate-100 dark:border-slate-800/50
                  ${pathname === link.href ? "text-blue-600 dark:text-blue-500" : "text-slate-900 dark:text-white"}
                `}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                {link.name}
                <ChevronRight
                  className={`
                    w-6 h-6 transition-transform duration-300 
                    ${pathname === link.href ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0"}
                  `}
                />
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <span className="font-medium text-slate-900 dark:text-white">Appearance</span>
              <ThemeToggle />
            </div>

            {isLoaded && (
              <div className="flex flex-col gap-4">
                {isSignedIn ? (
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    <span className="font-medium text-slate-900 dark:text-white">Account</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <SignInButton mode="modal">
                      <button className="w-full py-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}