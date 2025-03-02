"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";
import { resetPassword } from "@/actions/setting-actions";

const resetPasswordSchema = z
  .object({
    current_password: z.string(),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password do not match",
    path: ["confirm_password"],
  });

export default function ResetPasswordForm() {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      console.log(values);
      toast.promise(resetPassword(values), {
        loading: "Updating password...",
        success: (data) => data?.message,
        error: (err) => err.message,
      });
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2" /> Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your current password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Enter your new password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your new password again.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Change
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
