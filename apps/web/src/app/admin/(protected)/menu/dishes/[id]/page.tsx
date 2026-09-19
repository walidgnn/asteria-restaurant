"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { DishForm } from "../DishForm";
import { API_URL } from "@/lib/config";

export default function EditDishPage() {
  const params = useParams();
  const { token } = useAdminAuth();
  const [dish, setDish] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/menu/dishes/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDish);
  }, [token, params.id]);

  if (!dish) return <p className="text-stone">Loading...</p>;

  return (
    <div>
      <Link href="/admin/menu/dishes" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO DISHES
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-charcoal">Edit Dish</h1>
      <div className="mt-8">
        <DishForm
          initial={{
            id: dish.id,
            name: dish.name,
            description: dish.description ?? "",
            price: dish.price,
            categoryId: dish.categoryId,
            imageUrl: dish.images[0]?.url ?? "",
            isAvailable: dish.isAvailable,
            isFeatured: dish.isFeatured,
            customizationGroupIds: dish.customizationGroups.map((g: any) => g.groupId),
          }}
        />
      </div>
    </div>
  );
}