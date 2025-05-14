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
import { editEmployeeSchema } from "@/schemas/employee-schema";
import { editEmployee } from "@/actions/employee-actions";
import { useRouter } from "next/navigation";
import { Employee } from "@prisma/client";

type FormData = z.infer<typeof editEmployeeSchema>;

interface MyFormProps {
  data: Employee;
}

export default function EditEmployeeForm({ data }: MyFormProps) {
  const form = useForm<z.infer<typeof editEmployeeSchema>>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: data.name,
      department: data.department,
      phone: data.phone,
      email: data.email,
      id: data.id,
    },
  });
  const router = useRouter();

  async function onSubmit(data: FormData) {
    try {
      await toast.promise(editEmployee(data), {
        loading: "Updating Employee...",
        success: "Employee upated successfully!",
        error: (err) => err.message || "Failed to update user",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
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
        <Button type="submit" className="w-full">
          Update Employee
        </Button>
      </form>
    </Form>
  );
}
