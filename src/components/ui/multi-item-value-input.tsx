import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface InventorySelectorProps {
  fieldName: string; // The name of the field in the form schema (e.g., "inventory_items")
  inventoryOptions: { id: string; name: string }[]; // Options for inventory items
}

export const InventorySelector: React.FC<InventorySelectorProps> = ({
  fieldName,
  inventoryOptions,
}) => {
  const { control, register, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Inventory Items</FormLabel>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4">
              {/* Inventory Item Selection */}
              <FormControl className="flex-1">
                <Select
                  onValueChange={(value) =>
                    setValue(`${fieldName}.${index}.id`, value)
                  }
                  defaultValue={field.id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              {/* Quantity Input */}
              <FormControl className="flex-1">
                <Input
                  type="number"
                  min={1}
                  placeholder="Quantity"
                  {...register(`${fieldName}.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </FormControl>

              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" onClick={() => append({ id: "", quantity: 1 })}>
          Add Item
        </Button>
        <FormMessage />
      </FormItem>
    </div>
  );
};
