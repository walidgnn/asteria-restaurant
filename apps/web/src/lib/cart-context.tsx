"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type SelectedCustomization = {
  optionId: string;
  name: string;
  priceModifier: number;
};

export type CartItem = {
  lineId: string; // unique per dish+customization combo
  dishId: string;
  name: string;
  basePrice: number;
  customizations: SelectedCustomization[];
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: {
    dishId: string;
    name: string;
    basePrice: number;
    customizations?: SelectedCustomization[];
    quantity?: number;
  }) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  itemCount: number;
  subtotal: number;
  clearCart: () => void;
  toastMessage: string | null;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "asteria-cart";

function makeLineId(dishId: string, customizations: SelectedCustomization[]) {
  const optionIds = customizations.map((c) => c.optionId).sort().join(",");
  return `${dishId}::${optionIds}`;
}

function lineTotal(item: CartItem) {
  const modifiers = item.customizations.reduce((sum, c) => sum + c.priceModifier, 0);
  return (item.basePrice + modifiers) * item.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(input: {
    dishId: string;
    name: string;
    basePrice: number;
    customizations?: SelectedCustomization[];
    quantity?: number;
  }) {
    const customizations = input.customizations ?? [];
    const quantity = input.quantity ?? 1;
    const lineId = makeLineId(input.dishId, customizations);

    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          lineId,
          dishId: input.dishId,
          name: input.name,
          basePrice: input.basePrice,
          customizations,
          quantity,
        },
      ];
    });

    setToastMessage(`Added ${input.name} to your order`);
    setTimeout(() => setToastMessage(null), 2500);
  }

  function removeItem(lineId: string) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }

  function updateQuantity(lineId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + lineTotal(i), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        itemCount,
        subtotal,
        clearCart,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}