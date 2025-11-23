"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, FileVideo, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file) => {
        if (!file.type.startsWith("video/")) {
            toast.error("Please upload a video file");
            return false;
        }
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            toast.error("File size must be less than 50MB");
            return false;
        }
        return true;
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                toast.success("File added successfully!");
            }
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            }
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setUploading(true);
        // Simulate upload progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 10;
            if (currentProgress > 100) {
                currentProgress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    setUploading(false);
                    setFile(null);
                    setProgress(0);
                    toast.success("Upload complete! (Simulation)");
                }, 500);
            }
            setProgress(currentProgress);
        }, 200);
    };

    const removeFile = () => {
        setFile(null);
        setProgress(0);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-black dark:via-slate-900 dark:to-black">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Upload Your Reel</h1>
                    <p className="text-slate-500 dark:text-gray-400">Share your creativity with the world</p>
                </div>

                <div
                    className={`
            relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300
            flex flex-col items-center justify-center min-h-[400px]
            ${dragActive
                            ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                            : "border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 hover:border-slate-400 dark:hover:border-slate-500"
                        }
          `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleChange}
                        accept="video/*"
                        disabled={uploading || file}
                    />

                    {!file ? (
                        <>
                            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 animate-pulse-slow">
                                <Upload className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                                Drag & Drop Video
                            </h3>
                            <p className="text-slate-500 dark:text-gray-400 mb-6">or click to browse</p>
                            <div className="flex gap-4 text-sm text-slate-400 dark:text-gray-500">
                                <span className="flex items-center gap-1">
                                    <FileVideo size={16} /> MP4, WebM
                                </span>
                                <span className="flex items-center gap-1">
                                    <AlertCircle size={16} /> Max 50MB
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full relative z-20">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 flex items-center gap-4 mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <FileVideo size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-900 dark:text-white font-medium truncate">{file.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-gray-400">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                                {!uploading && (
                                    <button
                                        onClick={removeFile}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {uploading ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400">
                                        <span>Uploading...</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleUpload}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                                >
                                    <Upload size={20} />
                                    Upload Reel
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
