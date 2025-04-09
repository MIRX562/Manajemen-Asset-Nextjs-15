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
import { editAssetTypeSchema } from "@/schemas/asset-type-schema";
import { AssetType } from "@prisma/client";
import { editAssetType } from "@/actions/asset-type-actions";
import { useRouter } from "next/navigation";
import SuggestionInput from "@/components/ui/sugestion-input";
import { useEffect, useState } from "react";

interface MyFormProps {
  data: AssetType;
}

export default function EditAssetTypeForm({ data }: MyFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof editAssetTypeSchema>>({
    resolver: zodResolver(editAssetTypeSchema),
    defaultValues: data,
  });

  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/asset-types/categories");
        const data = await response.json();
        setCategories(
          data.map((item: { category: string }) => ({
            label: item.category,
            value: item.category,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }

    async function fetchManufacturers() {
      try {
        const response = await fetch("/api/asset-types/manufacturers");
        const data = await response.json();
        setManufacturers(
          data.map((item: { manufacturer: string }) => ({
            label: item.manufacturer,
            value: item.manufacturer,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch manufacturers", error);
      }
    }

    fetchCategories();
    fetchManufacturers();
  }, []);

  async function onSubmit(data: z.infer<typeof editAssetTypeSchema>) {
    try {
      toast.promise(editAssetType(data), {
        loading: "Updating asset type...",
        success: "Asset type updated successfully!",
        error: (err) => err.message || "Failed to update asset type",
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
                  suggestions={manufacturers}
                  placeholder="Select or type a manufacturer"
                  {...field}
                />
              </FormControl>
              <FormDescription>The company that makes the item</FormDescription>
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
                  suggestions={categories}
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
                  placeholder="Usage scope, terms, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Additional info about the item</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
