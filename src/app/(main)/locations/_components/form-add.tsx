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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createLocationSchema } from "@/schemas/location-schema";
import { createLocation } from "@/actions/location-actions";
import { useRouter } from "next/navigation";
import { LocationType } from "@prisma/client";

export default function AddLocationForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof createLocationSchema>>({
    resolver: zodResolver(createLocationSchema),
  });

  async function onSubmit(data: z.infer<typeof createLocationSchema>) {
    try {
      toast.promise(createLocation(data), {
        loading: "creating new location...",
        success: "new location created",
        error: "failed to create the location",
      });
      router.refresh();
    } catch (error) {
      console.error("Form submission error", error);
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
                <Input
                  placeholder="main office, main storage, ..."
                  type=""
                  {...field}
                />
              </FormControl>
              <FormDescription>The name of the location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="choose one" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={LocationType.KANTOR}>Kantor</SelectItem>
                  <SelectItem value={LocationType.GUDANG}>Gudang</SelectItem>
                  <SelectItem value={LocationType.DATA_CENTER}>
                    Data Center
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The type of the location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="jl. raya no 2 ...."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>The address of the location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Location</Button>
      </form>
    </Form>
  );
}
