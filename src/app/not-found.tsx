"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        staggerChildren: 0.1,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-xl border-t border-l border-white/20">
        <CardContent className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="text-center">
              <AlertTriangle className="w-20 h-20 mx-auto text-yellow-400" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-center text-white"
            >
              404
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-center text-gray-300"
            >
              Oops! Page not found
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-400"
            >
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex justify-center space-x-4"
            >
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 text-white/60 text-sm"
      >
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </motion.div>
    </div>
  );
}
