"use client";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { consumeItem } from "@/actions/inventory-actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  items: z.array(
    z.object({
      item_ID: z.coerce.number().min(1, "Select an item first"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    })
  ),
});

type Item = { id: number; name: string; quantity: number };

export default function UseItemsForm({ items }: { items: Item[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ item_ID: 0, quantity: 1 }],
    },
  });

  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast.promise(consumeItem(values), {
        loading: "Restocking items...",
        success: (data) => data.message,
        error: (err) => `${err.message}`,
      });
      router.refresh();
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="max-h-[70vh] overflow-y-auto space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 items-end max-h-[400px] overflow-auto pb-4 transition-all"
            >
              <div className="col-span-7">
                <FormField
                  control={form.control}
                  name={`items.${index}.item_ID`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Item (stock)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? `${
                                    items.find(
                                      (item) => item.id === field.value
                                    )?.name
                                  } (${
                                    items.find(
                                      (item) => item.id === field.value
                                    )?.quantity
                                  })`
                                : "Select an item"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search item..." />
                            <CommandList>
                              <CommandEmpty>No item found.</CommandEmpty>
                              <CommandGroup>
                                {items.map((item) => (
                                  <CommandItem
                                    value={item.name}
                                    key={item.id}
                                    onSelect={() => {
                                      form.setValue(
                                        `items.${index}.item_ID`,
                                        item.id
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        item.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {item.name} ({item.quantity})
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2 flex">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ item_ID: 0, quantity: 1 })}
          className="w-full flex items-center justify-center"
        >
          <PlusCircle className="mr-2 w-5 h-5" /> Add More Items
        </Button>

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
