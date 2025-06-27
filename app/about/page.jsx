"use client"

import { motion } from "framer-motion"
import { Sparkles, Video, UploadCloud, Users, Heart } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        {/* Title */}
        <h1 className="text-5xl font-bold mb-4 text-pink-500 tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-white" /> About ReelEdge
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-300 leading-relaxed mb-10">
          Welcome to <span className="text-white font-semibold">ReelEdge</span> – your creative editing playground 🎬. Whether you’re into cinematic edits, Insta bangers, or dreamy wedding vibes – we’ve built this for creators like **you**.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <UploadCloud className="w-6 h-6" />,
              title: "Upload Instantly",
              desc: "Push your best edits to the world. Just drag, drop, and shine.",
            },
            {
              icon: <Video className="w-6 h-6" />,
              title: "Watch Seamlessly",
              desc: "Explore bite-sized reels in a smooth, no-buffer player experience.",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Grow Together",
              desc: "Join a hub of editors, videographers, and visual artists.",
            },
            {
              icon: <Heart className="w-6 h-6" />,
              title: "Loved by Creators",
              desc: "Made by Gen-Z. For Gen-Z. Powered by aesthetic and vibes.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-pink-500 transition duration-300"
            >
              <div className="flex items-center gap-4 mb-3 text-pink-400">
                {item.icon}
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-sm text-gray-500">
          Built with ❤️ using Next.js, Tailwind, Clerk, Hygraph, and vibes.
        </div>
      </motion.div>
    </div>
  )
}
