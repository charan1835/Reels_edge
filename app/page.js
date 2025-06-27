import Navbar from "./_components/Navbar";
import VideoBackground from "./_components/videoBackground";
import CategoryList from "./_components/CategoryList";
import EditList from "./_components/EditList";
import Footer from "./_components/Footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Navbar />
      <VideoBackground />
      <div className="h-6 sm:h-12" />
      <CategoryList />

      <Suspense fallback={<div className="text-white p-4">Loading Edits...</div>}>
        <EditList />
      </Suspense>

      <Footer />
    </>
  );
}
