"use client";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useDropdownContext } from "@/context/dropdown";
import { MaintenanceStatus } from "@prisma/client";
import { scheduleMaintenanceSchema } from "@/schemas/maintenance-schema";
import { scheduleMaintenance } from "@/actions/maintenance-inventory-actions";
import { useRouter } from "next/navigation";

type FormProps = {
  inventoryItems: {
    id: number;
    name: string;
    quantity: number;
  }[];
  assets: {
    id: number;
    name: string;
  }[];
};

export default function ScheduleMaintenanceForm({
  inventoryItems,
  assets,
}: FormProps) {
  const { mechanics } = useDropdownContext();

  const form = useForm<z.infer<typeof scheduleMaintenanceSchema>>({
    resolver: zodResolver(scheduleMaintenanceSchema),
    defaultValues: {
      scheduled_date: new Date(),
      status: MaintenanceStatus.DIJADWALKAN,
    },
  });
  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventory",
  });

  function onSubmit(values: z.infer<typeof scheduleMaintenanceSchema>) {
    try {
      toast.promise(scheduleMaintenance(values), {
        loading: "Adding new Maintenance...",
        success: "New maintenance is scheduled",
        error: "failed to add new maintenance",
      });
      router.refresh();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-8"
      >
        <div className="space-y-4">
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

          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="scheduled_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Scheduled for</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>maintenance schedule</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
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
                    <FormDescription>Status of the maintenance</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  Additional information about the maintenance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full col-span-full md:col-span-1 space-y-2">
          <div className="flex items-center w-full justify-between">
            <div>
              <FormLabel>Inventory Items</FormLabel>
              <FormDescription>Items needed for maintenance</FormDescription>
            </div>
            <Button
              type="button"
              onClick={() => append({ item_id: "", quantity: 1 })}
              className="mt-4"
            >
              <PlusCircle />
              Add Item
            </Button>
          </div>

          <div className="space-y-4 w-full">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-4 items-center w-full"
              >
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name={`inventory.${index}.item_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={(value) =>
                              form.setValue(`inventory.${index}.item_id`, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Select an item"
                                value={field.value}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryItems.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.name} | stock:{item.quantity} |
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={`inventory.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
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

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
}
