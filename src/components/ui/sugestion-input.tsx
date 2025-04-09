"use client";

import type React from "react";
import { useState, useRef, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Suggestion = {
  value: string;
  label: string;
};

interface SuggestionInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSelect"> {
  suggestions: Suggestion[];
  onSuggestionSelect?: (value: string) => void;
  className?: string;
}

const SuggestionInput = forwardRef<HTMLInputElement, SuggestionInputProps>(
  (
    {
      suggestions = [],
      onSuggestionSelect,
      className,
      onChange,
      value: controlledValue,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(
      controlledValue?.toString() || ""
    );
    const [filteredSuggestions, setFilteredSuggestions] =
      useState<Suggestion[]>(suggestions);
    const commandRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Merge refs
    const handleRef = (element: HTMLInputElement) => {
      // Forward the ref to the parent component
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }

      // Keep our local ref
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        element;
    };

    // Update internal state when controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined) {
        setInputValue(controlledValue.toString());
      }
    }, [controlledValue]);

    // Filter suggestions based on input value
    useEffect(() => {
      if (inputValue) {
        setFilteredSuggestions(
          suggestions.filter((suggestion) =>
            suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      } else {
        setFilteredSuggestions(suggestions);
      }
    }, [inputValue, suggestions]);

    // Handle click outside to close popover
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          commandRef.current &&
          !commandRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // Call the original onChange handler
      if (onChange) {
        onChange(e);
      }
    };

    const handleSuggestionSelect = (value: string) => {
      setInputValue(value);

      // Create a synthetic event to trigger onChange
      if (onChange && inputRef.current) {
        const syntheticEvent = {
          target: {
            name: props.name,
            value,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      if (onSuggestionSelect) {
        onSuggestionSelect(value);
      }

      setOpen(false);
      inputRef.current?.focus();
    };

    return (
      <div className="relative">
        <Input
          ref={handleRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          className={cn("w-full", className)}
          {...props}
        />
        {open && (
          <div
            ref={commandRef}
            className="absolute top-full left-0 w-full z-10 mt-1 rounded-md border bg-popover shadow-md"
          >
            <Command className="rounded-lg border shadow-md">
              <CommandList>
                {filteredSuggestions.length === 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredSuggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.value}
                        onSelect={() =>
                          handleSuggestionSelect(suggestion.value)
                        }
                      >
                        {suggestion.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    );
  }
);

SuggestionInput.displayName = "SuggestionInput";

export default SuggestionInput;
