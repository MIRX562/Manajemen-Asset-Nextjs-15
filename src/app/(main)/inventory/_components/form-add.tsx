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
import { useDropdownStore } from "@/stores/dropdown-store";
import { createInventorySchema } from "@/schemas/inventory-schema";
import { useRouter } from "next/navigation";
import { createInventoryItem } from "@/actions/inventory-actions";
import SuggestionInput from "@/components/ui/sugestion-input";
import { useEffect } from "react";

export default function AddInventoryForm({
  sugestion,
}: {
  sugestion: { category: string }[];
}) {
  const router = useRouter();
  const locations = useDropdownStore((state) => state.locations);
  const fetchDropdownData = useDropdownStore(
    (state) => state.fetchDropdownData
  );
  const form = useForm<z.infer<typeof createInventorySchema>>({
    resolver: zodResolver(createInventorySchema),
  });
  const categorySugestion = sugestion.map((item) => ({
    label: item.category,
    value: item.category,
  }));

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  async function onSubmit(data: z.infer<typeof createInventorySchema>) {
    try {
      toast.promise(createInventoryItem(data), {
        loading: "creating new inventory item...",
        success: "new item created",
        error: "failed to create new item",
      });
      router.refresh();
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>
              <FormDescription>Item&apos;s name</FormDescription>
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
                  suggestions={categorySugestion}
                  placeholder="Select or type a category"
                  {...field}
                />
              </FormControl>
              <FormDescription>category the items belongs to</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormDescription>item&apos;s quantity</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="reorder_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    item&apos;s quantity left before restock
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price (Rp)</FormLabel>
              <FormControl>
                <Input placeholder="" type="number" {...field} />
              </FormControl>
              <FormDescription>price of each items</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>where the items is stored</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Item
        </Button>
      </form>
    </Form>
  );
}
