"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderDetails = {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  customerName: string;
  email: string;
  orderType: "pickup" | "delivery";
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  lastOrder: OrderDetails | null;
  placeOrder: (details: {
    customerName: string;
    email: string;
    orderType: "pickup" | "delivery";
  }) => string;
  toastMessage: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "asteria-cart";

function generateOrderId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `A${num}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);
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

    function addItem(item: { id: string; name: string; price: number }) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setToastMessage(`Added ${item.name} to your order`);
    setTimeout(() => setToastMessage(null), 2500);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function placeOrder(details: {
    customerName: string;
    email: string;
    orderType: "pickup" | "delivery";
  }) {
    const orderId = generateOrderId();
    setLastOrder({
      orderId,
      items,
      subtotal,
      ...details,
    });
    setItems([]);
    return orderId;
  }

    return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        itemCount,
        subtotal,
        lastOrder,
        placeOrder,
        toastMessage,
        clearCart,
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