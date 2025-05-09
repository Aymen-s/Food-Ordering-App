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
import { Restaurant } from "@/types";
import { useEffect } from "react";

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

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 1 }],
    },
  });

  useEffect(() => {
    if (restaurant) {
      const deliveryPriceFormatted = parseInt(
        (restaurant.deliveryPrice / 100).toFixed(2)
      );

      const menuItemsFormatted = restaurant.menuItems.map((item) => ({
        ...item,
        price: parseInt((item.price / 100).toFixed(2)),
      }));

      const updatedRestaurant = {
        ...restaurant,
        deliveryPrice: deliveryPriceFormatted,
        menuItems: menuItemsFormatted,
      };

      form.reset(updatedRestaurant);
    }
  }, [restaurant, form]);

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();
    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append(
      "deliveryPrice",
      (formDataJson.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    );
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(
        `menuItems[${index}][price]`,
        (menuItem.price * 100).toString()
      );
    });
    formData.append("imageFile", formDataJson.imageFile);
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    onSave(formData);
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
