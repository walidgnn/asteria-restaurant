import { API_URL } from "./config";

export type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  dishes: Dish[];
};

export async function getMenu(): Promise<MenuCategory[]> {
  const res = await fetch(`${API_URL}/menu`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch menu");
  }

  return res.json();
}