import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form } from "@/components/ui/form";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  restaurantName: z
    .string({
      required_error: "Restaurant name is required",
    })
    .min(1, "Restaurant name is required"),
  city: z
    .string({
      required_error: "City is required",
    })
    .min(1, "City is required"),
  country: z
    .string({
      required_error: "Country is required",
    })
    .min(1, "Country is required"),
  deliveryPrice: z.coerce
    .number({
      required_error: "Delivery price is required",
      invalid_type_error: "Delivery price must be a number",
    })
    .min(0, "Delivery price must be a positive number"),
  estimatedDeliveryTime: z.coerce
    .number({
      required_error: "Estimated delivery time is required",
      invalid_type_error: "Estimated delivery time must be a number",
    })
    .min(1, "Estimated delivery time must be at least 1 minute"),
  cuisines: z
    .array(
      z.string().nonempty({
        message: "Cuisine cannot be empty",
      })
    )
    .min(1, {
      message: "Please select at least one cuisine",
    }), // Ensure at least one cuisine
  menuItems: z
    .array(
      z.object({
        name: z.string().min(1, {
          message: "Menu item name is required",
        }), // Ensure non-empty name
        price: z.coerce.number().min(1, {
          message: "Price must be at least 1",
        }),
      })
    )
    .min(1, {
      message: "Please add at least one menu item",
    }), // Ensure at least one menu item
  imageFile: z.instanceof(File, { message: "Image file is required" }),
});

type restaurantFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading }: Props) => {
  const form = useForm<restaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  const onSubmit = (formDataJson: restaurantFormData) => {
    // TODO - convert formDataJson to a new FormData object
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
