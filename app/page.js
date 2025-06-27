"use client";

import Navbar from "./_components/Navbar";
import VideoBackground from "./_components/videoBackground";
import CategoryList from "./_components/CategoryList";
import EditList from "./_components/EditList";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <VideoBackground />
      {/* Add spacing between video and categories */}
      <div className="h-6 sm:h-12" />
      <CategoryList />
      <EditList />
      <Footer />
    </>
  );
}
