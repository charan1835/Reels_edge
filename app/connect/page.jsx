"use client";

import { useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { toast } from "sonner";

export default function ConnectPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = form;
    if (!name || !email || !message) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await GlobalApi.CreateContactSubmission(name, email, message);

      toast.success("Message submitted successfully 🚀");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Submission failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-block mb-6">
              <div className="relative">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Let's Connect
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-full opacity-50 animate-pulse"></div>
              </div>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? Drop me a message and let's create something amazing together ✨
            </p>
          </div>

          {/* Form Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/25">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                      placeholder="Enter your full name"
                    />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'name' ? 'opacity-100' : ''}`}></div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                      placeholder="your.email@example.com"
                    />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'email' ? 'opacity-100' : ''}`}></div>
                  </div>
                </div>

                {/* Message Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400">
                    Your Message
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={6}
                      className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] resize-none"
                      placeholder="Tell me about your project, ideas, or just say hello!"
                    />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'message' ? 'opacity-100' : ''}`}></div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full md:w-auto min-w-[200px] px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <div className="transform transition-transform group-hover:translate-x-1">
                            🚀
                          </div>
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { icon: "⚡", title: "Quick Response", desc: "I'll get back to you within 24 hours" },
                { icon: "🎯", title: "Focused Solutions", desc: "Tailored approaches for your specific needs" },
                { icon: "🤝", title: "Collaborative", desc: "Working together every step of the way" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="text-3xl mb-3 transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}