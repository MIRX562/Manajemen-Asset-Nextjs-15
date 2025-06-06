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
import { Input } from "@/components/ui/input";
import { User, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { editUserSchema } from "@/schemas/user-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editUser } from "@/actions/user-actions";
import { PasswordInput } from "@/components/ui/password-input";
import { resetUserPassword } from "@/actions/setting-actions";
import { Separator } from "@/components/ui/separator";

type FormData = z.infer<typeof editUserSchema>;

interface MyFormProps {
  data: User;
}

const resetPasswordSchema = z
  .object({
    user_id: z.number(),
    new_password: z
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
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password do not match",
    path: ["confirm_password"],
  });

export default function EditUserForm({ data }: MyFormProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: data,
  });

  async function onSubmit(formData: FormData) {
    try {
      toast.promise(editUser(formData), {
        loading: "Updating user...",
        success: "User updated successfully!",
        error: (err) => err.message || "Failed to update user",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  const formPassword = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      user_id: data.id,
      confirm_password: "",
      new_password: "",
    },
  });

  function onSubmitPassword(values: z.infer<typeof resetPasswordSchema>) {
    try {
      toast.promise(resetUserPassword(values), {
        loading: "Updating password...",
        success: (data) => data?.message,
        error: (err) => err.message,
      });
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn@mail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                    <SelectItem value={Role.INVENTARIS}>Inventaris</SelectItem>
                    <SelectItem value={Role.TEKNISI}>Teknisi</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the user&apos;s role.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Update User
          </Button>
        </form>
      </Form>
      <Form {...formPassword}>
        <form
          onSubmit={formPassword.handleSubmit(onSubmitPassword)}
          className="space-y-3 px-1 mt-4"
        >
          <Separator />

          <h1 className="text-xl font-bold">Change User Password</h1>

          <FormField
            control={formPassword.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="" {...field} />
                </FormControl>
                <FormDescription>Enter user's new password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formPassword.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Enter user's new password again.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formPassword.control}
            name="user_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>User Id</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="text" disabled {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            Change Password
          </Button>
        </form>
      </Form>
    </>
  );
}
