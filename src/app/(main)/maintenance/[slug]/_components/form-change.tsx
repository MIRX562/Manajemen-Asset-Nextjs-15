"use client";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  editAssetMechanicSchema,
  editInventorySchema,
} from "@/schemas/maintenance-schema";
import {
  updateAssetMechanic,
  updateInventory,
} from "@/actions/maintenance-actions";
import { useDropdownContext } from "@/context/dropdown";
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type EditAssetMechanicFormProps = {
  assets: { id: number; name: string }[];
  initialData: { asset_id: number; mechanic_id: number };
};

export function EditAssetMechanicForm({
  assets,
  initialData,
}: EditAssetMechanicFormProps) {
  const form = useForm<z.infer<typeof editAssetMechanicSchema>>({
    resolver: zodResolver(editAssetMechanicSchema),
    defaultValues: initialData,
  });
  const router = useRouter();
  const { mechanics } = useDropdownContext();

  function onSubmit(values: z.infer<typeof editAssetMechanicSchema>) {
    toast.promise(updateAssetMechanic(values), {
      loading: "Updating asset & mechanic...",
      success: "Asset & mechanic updated successfully",
      error: "Failed to update",
    });
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4 px-1">
          <FormField
            control={form.control}
            name="asset_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Asset</FormLabel>
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
                          ? assets.find((asset) => asset.id === field.value)
                              ?.name
                          : "Select asset"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search asset..." />
                      <CommandList>
                        <CommandEmpty>No asset found.</CommandEmpty>
                        <CommandGroup>
                          {assets.map((asset) => (
                            <CommandItem
                              value={asset.name}
                              key={asset.id}
                              onSelect={() => {
                                form.setValue("asset_id", asset.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  asset.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {asset.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>maintenance asset</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mechanic_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Mechanic</FormLabel>
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
                          ? mechanics.find(
                              (mechanic) => mechanic.id === field.value
                            )?.username
                          : "Select mechanic"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search mechanic..." />
                      <CommandList>
                        <CommandEmpty>No mechanic found.</CommandEmpty>
                        <CommandGroup>
                          {mechanics.map((mechanic) => (
                            <CommandItem
                              value={mechanic.username}
                              key={mechanic.id}
                              onSelect={() => {
                                form.setValue("mechanic_id", mechanic.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  mechanic.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {mechanic.username}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>assign a mechanic</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem hidden>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" disabled type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}

type FormInventoryProps = {
  inventoryItems: {
    id: number;
    name: string;
    quantity: number;
  }[];
  initialData: {
    id: number;
    inventory: {
      inventory_id: number;
      quantity_used: number;
      inventory: { name: string };
    }[];
  };
};

export function EditInventoryForm({
  inventoryItems,
  initialData,
}: FormInventoryProps) {
  const form = useForm<z.infer<typeof editInventorySchema>>({
    resolver: zodResolver(editInventorySchema),
    defaultValues: {
      ...initialData,
    },
  });
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventory",
  });

  function onSubmit(values: z.infer<typeof editInventorySchema>) {
    toast.promise(updateInventory(values), {
      loading: "Updating inventory...",
      success: "Inventory updated successfully",
      error: "Failed to update",
    });
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <div className="w-full col-span-full md:col-span-1 space-y-2">
          <div className="flex items-center w-full justify-between">
            <div>
              <FormLabel>Inventory Items</FormLabel>
            </div>
          </div>

          <div className="space-y-4 w-full">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-4 items-end w-full"
              >
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name={`inventory.${index}.inventory_id`}
                    render={({ field }) => {
                      // Get already selected inventory IDs
                      const selectedIds = form
                        .getValues("inventory")
                        .map((inv) => inv.inventory_id);

                      // Filter inventory items to exclude selected ones (except the current field value)
                      const availableInventory = inventoryItems.filter(
                        (inventory) =>
                          inventory.id === field.value ||
                          !selectedIds.includes(inventory.id)
                      );

                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Inventory</FormLabel>
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
                                    ? inventoryItems.find(
                                        (inventory) =>
                                          inventory.id === field.value
                                      )?.name
                                    : "Select inventory"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search inventory..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No inventory found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {availableInventory.map((inventory) => (
                                      <CommandItem
                                        value={inventory.name}
                                        key={inventory.id}
                                        onSelect={() => {
                                          form.setValue(
                                            `inventory.${index}.inventory_id`,
                                            inventory.id
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            inventory.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {inventory.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={`inventory.${index}.quantity_used`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Quantity"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem hidden>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" disabled type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => append({ inventory_id: 0, quantity_used: 1 })}
          >
            <PlusCircle />
            Add Item
          </Button>
          <Button type="submit" className="w-full">
            Update Inventory
          </Button>
        </div>
      </form>
    </Form>
  );
}
