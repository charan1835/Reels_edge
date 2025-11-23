"use client";

import React from "react";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 text-sm md:text-base text-slate-800 dark:text-white/90 animate-fade-in-up shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>The Future of Cinematic Reels</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white animate-fade-in-up delay-100">
                    <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                        Unleash Your
                    </span>
                    <span className="block mt-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-500 dark:via-purple-500 dark:to-indigo-500 bg-clip-text text-transparent">
                        Creative Vision
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-gray-300 leading-relaxed animate-fade-in-up delay-200">
                    Discover, share, and connect with a community of creators.
                    Experience video editing like never before with ReelEdge.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                    <button
                        onClick={() => {
                            const categorySection = document.getElementById('categories');
                            categorySection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                    >
                        <span className="flex items-center gap-2">
                            Start Watching <Play size={20} className="fill-current" />
                        </span>
                    </button>

                    <Link href="/upload">
                        <button className="group px-8 py-4 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 hover:scale-105 shadow-sm">
                            <span className="flex items-center gap-2">
                                Upload Reel <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </Link>
                </div>

                {/* Stats / Social Proof */}
                <div className="pt-12 flex items-center justify-center gap-8 md:gap-16 text-slate-500 dark:text-white/60 animate-fade-in-up delay-500">
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">10K+</div>
                        <div className="text-xs md:text-sm uppercase tracking-wider">Creators</div>
                    </div>
                    <div className="w-px h-12 bg-slate-300 dark:bg-white/10"></div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">50K+</div>
                        <div className="text-xs md:text-sm uppercase tracking-wider">Reels</div>
                    </div>
                    <div className="w-px h-12 bg-slate-300 dark:bg-white/10"></div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">24/7</div>
                        <div className="text-xs md:text-sm uppercase tracking-wider">Inspiration</div>
                    </div>
                </div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-black to-transparent z-10"></div>
        </div>
    );
}
