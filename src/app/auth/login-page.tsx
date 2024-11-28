"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Here you would typically call your login API
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard"); // Redirect to dashboard on successful login
      } else {
        const errorData = await response.json();
        setServerError(errorData.error || "Failed to login. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.07,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200 },
    },
  };

  return (
    <Suspense>
      <div className="min-h-screen bg-gradient-to-tl from-gray-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <CardHeader>
              <CardTitle>
                <motion.h2
                  variants={childVariants}
                  className="text-2xl font-bold text-center text-white"
                >
                  Welcome Back
                </motion.h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div variants={childVariants}>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-800"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-300 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>
                <motion.div variants={childVariants}>
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                      size={18}
                    />
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-800"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-300 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>
                {serverError && (
                  <motion.div variants={childVariants}>
                    <Alert
                      variant="destructive"
                      className="bg-red-500/50 border-red-600 text-white"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                <motion.div
                  variants={childVariants}
                  className="flex flex-col gap-2"
                >
                  <Separator />
                  <Button
                    type="submit"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Log In"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </motion.div>
        </Card>
      </div>
    </Suspense>
  );
}
