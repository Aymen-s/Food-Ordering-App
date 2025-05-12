import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurant } from "@/api/RestaurantApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItemCard from "@/components/MenuItemCard";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { MenuItem } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { restaurant, isPending } = useGetRestaurant(restaurantId);
  const { createCheckoutSession, isLoading: isCheckoutLoading } =
    useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    if (cartItems) {
      return JSON.parse(cartItems);
    }
    return [];
  });

  const addToCart = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === menuItem._id);
      const updatedCart = existingItem
        ? prev.map((item) =>
            item._id === menuItem._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...menuItem, quantity: 1 }];

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCart)
      );
      return updatedCart;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item._id !== cartItem._id);
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCart)
      );
      return updatedCart;
    });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      return;
    }
    const checkoutData = {
      cartItems: cartItems.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        quantity: item.quantity.toString(),
      })),
      deliveryDetails: {
        email: userFormData.email as string,
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
      },
      restaurantId: restaurant?._id,
    };

    const data = await createCheckoutSession(checkoutData);
    window.location.href = data.url;
  };

  if (isPending || !restaurant) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItemCard
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div>
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckoutButton
                disabled={cartItems.length === 0}
                onCheckout={onCheckout}
                isLoading={isCheckoutLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
