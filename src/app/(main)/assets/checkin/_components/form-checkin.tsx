"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { checkIn } from "@/actions/checkinout-actions";

const formSchema = z.object({
  id: z.number(),
  actual_return_date: z.coerce.date(),
});

type CheckedOutAssets = {
  id: number;
  asset: {
    name: string;
  };
}[];

export default function CheckInForm({ data }: { data: CheckedOutAssets }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      actual_return_date: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(checkIn(values), {
      loading: "Checking in...",
      success: "Asset checked in",
      error: "Something went wrong!",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
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
                        ? data.find((item) => item.id === field.value)?.asset
                            .name
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
                        {data.map(({ id, asset }) => (
                          <CommandItem
                            key={id}
                            value={id.toString()}
                            onSelect={() => form.setValue("id", id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                id === field.value ? "opacity-100" : "opacity-0"
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
              <FormDescription>Select asset to check in</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="actual_return_date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Return Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
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
                    onSelect={(date) => field.onChange(date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When the asset is checked in</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Check In</Button>
      </form>
    </Form>
  );
}
