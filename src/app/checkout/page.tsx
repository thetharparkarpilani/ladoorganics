import { redirect } from "next/navigation";

export default function CheckoutPage() {
  // Checkout is handled from the live cart drawer so the customer sees
  // their actual cart and the server recalculates every product price.
  redirect("/#store");
}
