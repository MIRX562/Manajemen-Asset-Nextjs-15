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
import { addEmployeeSchema } from "@/schemas/employee-schema";
import { addEmployee } from "@/actions/employee-actions";
import { useRouter } from "next/navigation";

export default function AddEmployeeForm() {
  const form = useForm<z.infer<typeof addEmployeeSchema>>({
    resolver: zodResolver(addEmployeeSchema),
  });
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof addEmployeeSchema>) {
    try {
      await toast.promise(addEmployee(data), {
        loading: "Adding employee...",
        success: "Employee added successfully!",
        error: (err) => err.message || "Failed to add Employee",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="" {...field} />
              </FormControl>
              <FormDescription>Name of the employee</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="text" {...field} />
              </FormControl>
              <FormDescription>
                Department where the employee belongs to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="08..." type="text" {...field} />
              </FormControl>
              <FormDescription>Employee phone number</FormDescription>
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
                  placeholder="something@mail.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>Employee&apos;s email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
