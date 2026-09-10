import Link from "next/link";
import { DishForm } from "../DishForm";

export default function NewDishPage() {
  return (
    <div>
      <Link href="/admin/menu/dishes" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO DISHES
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-charcoal">New Dish</h1>
      <div className="mt-8">
        <DishForm />
      </div>
    </div>
  );
}