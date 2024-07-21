import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateTagProps } from "@/types";
import { PopoverClose } from "@radix-ui/react-popover";

function DateTag({ onSelectDate, onButtonClick, buttonText }: DateTagProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const selectDateHandler = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onSelectDate(selectedDate);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>All Time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={selectDateHandler}
          />
        </div>
        <PopoverClose>
          <span
            onClick={() => {
              onButtonClick();
              setDate(undefined);
            }}
            className={`w-full ${buttonVariants({ variant: "default" })}`}
          >
            {buttonText}
          </span>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

export default DateTag;
