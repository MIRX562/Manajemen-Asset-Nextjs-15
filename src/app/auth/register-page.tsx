"use client";

import { useState } from "react";
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
import { User, Mail, Lock, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const registerSchema = z
  .object({
    username: z.string(),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at most 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setServerError(errorData.error);
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
                Create Your First Admin Account
              </motion.h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={childVariants}>
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                    size={18}
                  />
                  <Input
                    id="username"
                    {...register("username")}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-900"
                    placeholder="johndoe"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-300 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </motion.div>
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
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-900"
                    placeholder="john@example.com"
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
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-300 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>
              <motion.div variants={childVariants}>
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                    size={18}
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-900 mt-1">
                    {errors.confirmPassword.message}
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
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </motion.div>
      </Card>
    </div>
  );
}
