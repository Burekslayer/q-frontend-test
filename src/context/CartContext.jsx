import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext({
  items: [],               // array of { id, title, price, imageUrl, quantity }
  addToCart: () => {},
  decrementQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalPrice: 0,
  totalItems: 0,
});

export function CartProvider({ children }) {
  // 1) Read from localStorage on first render. If nothing is there, initialize to [].
  const [items, setItems] = useState(() => {
    try {
      const saved = window.localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error parsing cartItems from localStorage:', err);
      return [];
    }
  });

  // 2) Write to localStorage whenever `items` changes.
  useEffect(() => {
    try {
      window.localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (err) {
      console.error('Error writing cartItems to localStorage:', err);
    }
  }, [items]);

  // -------------------------
  // Cart manipulation helpers
  // -------------------------

  // a) addToCart: if product.id already exists, increment its quantity,
  // otherwise push a new { ...product, quantity:1 }
  const addToCart = (product) => {
    setItems((currentItems) => {
      const exists = currentItems.find((i) => i.id === product.id);
      if (exists) {
        return currentItems.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  // b) decrementQuantity: subtract 1 from quantity, or remove line if quantity hits 0
  const decrementQuantity = (productId) => {
    setItems((currentItems) =>
      currentItems
        .map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // c) removeFromCart: drop the entire line immediately
  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((i) => i.id !== productId));
  };

  // d) clearCart: wipe everything
  const clearCart = () => setItems([]);

  // -------------------------
  // Computed totals
  // -------------------------

  // total price = sum of (price × quantity)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // total items = sum of quantity
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        decrementQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
