"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Heart, Video, Grid, Settings } from "lucide-react";

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-slate-900 dark:text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-slate-900 dark:text-white px-4">
                <h1 className="text-3xl font-bold mb-4">Sign in to view profile</h1>
                <p className="text-slate-500 dark:text-gray-400 mb-8">Join the community to manage your reels.</p>
                {/* The SignInButton in Navbar handles the actual sign in */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="relative group">
                        <img
                            src={user.imageUrl}
                            alt={user.fullName}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-200 dark:border-slate-800 object-cover shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Settings className="text-white" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                        <p className="text-slate-500 dark:text-gray-400 mb-6">@{user.username || user.firstName?.toLowerCase()}</p>

                        <div className="flex justify-center md:justify-start gap-8">
                            <div className="text-center">
                                <div className="text-xl font-bold">0</div>
                                <div className="text-sm text-slate-500 dark:text-gray-500">Reels</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold">0</div>
                                <div className="text-sm text-slate-500 dark:text-gray-500">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold">0</div>
                                <div className="text-sm text-slate-500 dark:text-gray-500">Following</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-slate-200 dark:border-slate-800 mb-8">
                    <div className="flex justify-center gap-12">
                        <button className="flex items-center gap-2 py-4 border-t-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium">
                            <Grid size={20} />
                            <span>REELS</span>
                        </button>
                        <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 transition-colors">
                            <Heart size={20} />
                            <span>LIKED</span>
                        </button>
                    </div>
                </div>

                {/* Content Grid (Placeholder) */}
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="aspect-[9/16] bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center group cursor-pointer relative overflow-hidden border border-slate-200 dark:border-slate-800">
                            <Video className="text-slate-300 dark:text-slate-700 w-12 h-12 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                                <div className="flex items-center gap-1">
                                    <Heart size={16} className="fill-white" /> 0
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-slate-500 dark:text-gray-500 text-sm">
                    <p>Upload your first reel to see it here!</p>
                </div>
            </div>
        </div>
    );
}
