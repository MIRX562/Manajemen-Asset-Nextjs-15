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

type FormData = z.infer<typeof editUserSchema>;

interface MyFormProps {
  data: User;
}

export default function EditUserForm({ data }: MyFormProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: data, // Set default values here
  });

  async function onSubmit(formData: FormData) {
    try {
      await toast.promise(editUser(formData), {
        loading: "Updating user...",
        success: "User updated successfully!",
        error: (err) => err.message || "Failed to update user",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input placeholder="shadcn@mail.com" type="email" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
