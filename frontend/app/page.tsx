"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Leaf, Mail, Github, Heart, ArrowDown, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";


export default function Main() {
  const { user, error, isLoading } = useUser();
  const [showButtons, setShowButtons] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [showAboutCard, setShowAboutCard] = useState(false);
  console.log(user)

  // Simulate a delay for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000); // Delay before buttons appear
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll for motivational quote
  setTimeout(() => {
    setShowQuote(false);
  }, 2000);
  const router = useRouter()
  const handleClick_dash=()=>{
    router.push('/Home')
  }

  const toggleAboutCard = () => {
    setShowAboutCard(!showAboutCard);
  };


  if (error) return <p>{error.message}</p>;
  function getTimeOfDay() {
    const hours = new Date().getHours(); // Get current hour (0 to 23)
    
    if (hours >= 5 && hours < 12) {
      return "Good Morning";
    } else if (hours >= 12 && hours < 17) {
      return "Good Afternoon";
    } else if (hours >= 17 && hours < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-green-900 to-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background Graphics */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Original background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-600 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-700 rounded-full blur-3xl opacity-30 animate-float-delay"></div>
        
        {/* New animated elements */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-emerald-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-teal-700 rounded-full blur-3xl opacity-20 animate-float-slow"></div>
        
        {/* Particle-like elements */}
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-green-400 rounded-full opacity-70 animate-float-fast"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-green-300 rounded-full opacity-60 animate-float-fast-delay"></div>
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-emerald-300 rounded-full opacity-80 animate-float-fast"></div>
        <div className="absolute top-3/4 right-1/4 w-5 h-5 bg-teal-400 rounded-full opacity-70 animate-pulse-fast"></div>
      </motion.div>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative z-10">
        {/* Product Name and Description */}
        <motion.div
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-bold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-12 h-12 text-green-500 animate-spin-slow" />
            Welcome to ECO-Assist
            <Sparkles className="w-12 h-12 text-green-500 animate-spin-slow" />
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your personal guide to sustainable living. Please login/sign up to continue.
          </p>
        </motion.div>

        {/* Login/Signup Buttons */}
        <AnimatePresence>
          {(showButtons && !user) && (
            <motion.div
              className="flex gap-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-lg shadow-lg transform transition-all hover:scale-105"
              >
                <a href="/api/auth/login">Login</a>
              </Button>
              <Button
                asChild
                className="bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-6 px-8 rounded-lg shadow-lg transform transition-all hover:scale-105"
              >
                <a href="/api/auth/login">Sign Up</a>
              </Button>
            </motion.div>
          )
          
          }
        </AnimatePresence>


        {/* User Greeting (if logged in) */}
        {user && (
          <motion.div
            className="mt-8 text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            
            <h1 className="text-4xl font-bold">{getTimeOfDay()}, {user.name}!</h1>
            <p className="text-lg text-gray-300">Email: {user.email}</p>
            <br></br>
            <Button
                onClick={handleClick_dash}
                className="bg-black hover:bg-green-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg"
                >
                Dashboard
                </Button>
          </motion.div>
        )}

        {/* Scroll down indicator */}
        <motion.div
          className="absolute bottom-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-8 h-8 text-green-400" />
        </motion.div>
      </section>

      {/* Motivational Quote with vanishing on scroll */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-900/80 backdrop-blur-sm p-4 rounded-lg shadow-lg z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-white">
              "The Earth is what we all have in common. Let's protect it together."
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Improved Gradient Transition */}
      <div className="w-full h-48 bg-gradient-to-b from-green-900/80 via-green-950/90 to-black"></div>

      {/* About Us Section with Pop-up Card */}
      <section className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative">
        <motion.div
          className="max-w-4xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Leaf className="w-8 h-8 text-green-500" />
            About Us
          </h2>
          
          <Button 
            onClick={toggleAboutCard} 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg mb-6"
          >
            Learn More About ECO-Assist
          </Button>

          {/* Pop-up About Card */}
          <AnimatePresence>
            {showAboutCard && (
              <motion.div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleAboutCard}
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="bg-green-950 border border-green-800 text-white max-w-3xl">
                    <CardContent className="p-6">
                      <Button 
                        className="absolute top-2 right-2 bg-transparent hover:bg-green-800 text-white" 
                        onClick={toggleAboutCard}
                      >
                        ✕
                      </Button>
                      <h3 className="text-2xl font-bold mb-4 text-green-400">About ECO-Assist</h3>
                      <p className="text-lg mb-4">
                        ECO-Assist is a Generative AI platform designed to help individuals reduce their carbon footprint. Our mission is to empower you with actionable insights and tools to live a more sustainable lifestyle.
                      </p>
                      <p className="text-lg mb-4">
                        From energy-saving tips to eco-friendly product recommendations, we're here to guide you every step of the way toward a greener future.
                      </p>
                      <p className="text-lg">
                        Join us in making a difference for our planet. Together, we can create a more sustainable world for generations to come.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visual elements for About section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {["Reduce", "Reuse", "Recycle"].map((title, index) => (
              <motion.div
                key={index}
                className="bg-green-900/40 backdrop-blur-sm p-6 rounded-lg border border-green-800"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-green-400 mb-2">{title}</h3>
                <p className="text-gray-300">
                  {index === 0 && "Minimize your carbon footprint by consuming less and choosing sustainable alternatives."}
                  {index === 1 && "Extend the lifecycle of products by repairing, repurposing, and sharing resources."}
                  {index === 2 && "Properly sort and process waste to recover materials and reduce landfill impact."}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Improved Gradient Transition */}
      <div className="w-full h-48 bg-gradient-to-b from-black via-green-950/20 to-black"></div>

      {/* Contact Us Section with Clickable Buttons */}
     {/* Contact Us Section with Clickable Buttons */}
<section className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
  <motion.div
    className="max-w-4xl text-center"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
  >
    <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
      <Mail className="w-8 h-8 text-green-500" />
      Contact Us
    </h2>
    <p className="text-lg text-gray-300 mb-8">
      Have questions or feedback? We'd love to hear from you! Reach out to us:
    </p>

    {/* Contact Buttons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
      {/* Email Button */}
      <Button
        asChild
        className="bg-green-700 hover:bg-green-600 text-white font-semibold py-8 rounded-lg shadow-lg flex items-center justify-center gap-2"
      >
        <a
          href="mailto:solutionscode@gmail.com"
          className="flex items-center gap-2"
        >
          <Mail className="w-6 h-6" />
          <span>Email Us</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </Button>

      {/* GitHub Button */}
      <Button
        asChild
        className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-8 rounded-lg shadow-lg flex items-center justify-center gap-2"
      >
        <a
          href="https://github.com/ASHLESHA05"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Github className="w-6 h-6" />
          <span>GitHub</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </Button>
    </div>

    {/* Additional Contact Graphics */}
    <motion.div
      className="mt-16 p-6 bg-green-900/30 backdrop-blur-sm rounded-lg border border-green-800"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold text-green-400 mb-4">Join Our Community</h3>
      <p className="text-gray-300">
        Connect with eco-conscious individuals and stay updated on the latest sustainability practices. Together, we can make a difference.
      </p>
    </motion.div>
  </motion.div>
</section>

      {/* Footer with improved styling */}
      <footer className="w-full bg-black text-white py-12 border-t border-green-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-300">
            &copy; {new Date().getFullYear()} ECO-Assist. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
            Made with <Heart className="inline w-4 h-4 text-red-500" /> for a greener planet.
          </p>
          
          {/* Footer Decorative Element */}
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}