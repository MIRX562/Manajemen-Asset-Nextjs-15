"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Boxes, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      const { user } = await getCurrentSession();
      if (user) {
        router.push("/dashboard"); // Redirect if session exists
      } else {
        setMounted(true); // Render component if no session
      }
    };
    checkSession();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="text-center">
              <Boxes className="w-16 h-16 mx-auto text-yellow-500" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Welcome to Our Asset Management App
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-600"
            >
              Discover a world of possibilities and innovation.
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Get Started
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 text-white text-sm"
      >
        © 2023 Amazing App. All rights reserved.
      </motion.div>
    </div>
  );
}
