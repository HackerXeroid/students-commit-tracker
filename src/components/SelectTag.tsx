import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectTagProps = {
  className?: string;
  defaultOption?: string;
  options: string[];
  placeholder?: string;
  label?: string;
  onValueChange: (value: string) => void;
};

function SelectTag({
  className,
  onValueChange,
  defaultOption,
  options,
  placeholder,
  label,
}: SelectTagProps) {
  return (
    <div className={className || ""}>
      <Select defaultValue={defaultOption || ""} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectTag;
