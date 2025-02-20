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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MaintenanceStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { updateMaintenanceStatusSchema } from "@/schemas/maintenance-schema";
import { updateMaintenanceStatus } from "@/actions/maintenance-actions";
import { useRouter } from "next/navigation";

export default function UpdateMaintenaceForm(
  data: z.infer<typeof updateMaintenanceStatusSchema>
) {
  const form = useForm<z.infer<typeof updateMaintenanceStatusSchema>>({
    resolver: zodResolver(updateMaintenanceStatusSchema),
    defaultValues: data,
  });

  const router = useRouter();
  function onSubmit(values: z.infer<typeof updateMaintenanceStatusSchema>) {
    try {
      console.log(values);
      toast.promise(updateMaintenanceStatus(values), {
        loading: "updating maintenance status...",
        success: "status updated",
        error: "failed to update status",
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="maintenance_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={MaintenanceStatus.DIJADWALKAN}>
                    Dijadwalkan
                  </SelectItem>
                  <SelectItem value={MaintenanceStatus.SELESAI}>
                    Selesai
                  </SelectItem>
                  <SelectItem value={MaintenanceStatus.TERTUNDA}>
                    Tertunda
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Current status of the maintenance.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Placeholder"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Additional notes about the maintenance.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem hidden>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" disabled type="number" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
