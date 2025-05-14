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
import { Textarea } from "@/components/ui/textarea";
import { addAssetTypeSchema } from "@/schemas/asset-type-schema";
import { createAssetType } from "@/actions/asset-type-actions";
import { useRouter } from "next/navigation";
import SuggestionInput from "@/components/ui/sugestion-input";

export default function AddAssetTypeForm({
  existingCategories,
  existingManufacturers,
}: {
  existingCategories: { category: string }[];
  existingManufacturers: { manufacturer: string }[];
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof addAssetTypeSchema>>({
    resolver: zodResolver(addAssetTypeSchema),
  });

  const categorySuggestions = existingCategories.map((item) => ({
    label: item.category,
    value: item.category,
  }));

  const manufacturerSuggestions = existingManufacturers.map((item) => ({
    label: item.manufacturer,
    value: item.manufacturer,
  }));

  async function onSubmit(data: z.infer<typeof addAssetTypeSchema>) {
    try {
      toast.promise(createAssetType(data), {
        loading: "Adding asset type...",
        success: "Asset type added successfully!",
        error: (err) => err.message || "Failed to add asset type",
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
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="macbook air 2017" type="" {...field} />
              </FormControl>
              <FormDescription>Model/series of the item</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <SuggestionInput
                  suggestions={manufacturerSuggestions}
                  placeholder="Select or type a category"
                  {...field}
                />
              </FormControl>
              <FormDescription>The company that make the item</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <SuggestionInput
                  suggestions={categorySuggestions}
                  placeholder="Select or type a category"
                  {...field}
                />
              </FormControl>
              <FormDescription>Category of the item</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="usage scope, terms, etc.."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Additional info about the item</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Asset Type</Button>
      </form>
    </Form>
  );
}
