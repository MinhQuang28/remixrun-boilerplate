import { cn } from "@/lib/utils";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  className?: string;
  isDisplayAllOption: boolean;
}

function MultiSelect({
  options,
  className,
  isDisplayAllOption,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const [allSelected, setAllSelected] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isDisplayAllOption) {
      if (selected.length === options.length) {
        setAllSelected(true);
      } else {
        setAllSelected(false);
      }
    }
  }, [isDisplayAllOption, selected, options]);

  const handleUnselect = (item: string) => {
    setSelected(selected.filter((i) => i !== item));
  };

  const handleisDisplayAllOption = () => {
    if (allSelected && selected) {
      setSelected([]);
    } else {
      const allValues = options.map((option) => option.value);
      setSelected(allValues);
    }
    setAllSelected(!allSelected);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${
            selected.length > 1 ? "h-full" : "h-10"
          }`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item}
                className="mr-1 mb-1"
                onClick={() => handleUnselect(item)}
              >
                {item}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandItem onSelect={handleisDisplayAllOption}>
              {allSelected ? "Unselect All" : "Select All"}
            </CommandItem>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  setSelected(
                    selected.includes(option.value)
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value],
                  );
                  setOpen(true);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
