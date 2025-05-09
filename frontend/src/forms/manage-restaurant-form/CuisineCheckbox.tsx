import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

type Props = {
  cuisine: string;
  field: ControllerRenderProps<FieldValues, "cuisines">;
};

const CuisineCheckbox = ({ cuisine, field }: Props) => {
  const isChecked = Array.isArray(field.value) && field.value.includes(cuisine);

  const handleCheckedChange = (checked: boolean) => {
    if (!Array.isArray(field.value)) return;

    const updatedValue = checked
      ? [...field.value, cuisine]
      : field.value.filter((item) => item !== cuisine);

    field.onChange(updatedValue);
  };

  return (
    <FormItem className="flex flex-row items-center space-x-1 space-y-0 mt-2">
      <FormControl>
        <Checkbox
          className="bg-white"
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
        />
      </FormControl>
      <FormLabel className="text-sm font-normal">{cuisine}</FormLabel>
    </FormItem>
  );
};

export default CuisineCheckbox;
