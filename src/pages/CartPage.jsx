// src/pages/CartPage.jsx
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaTimes } from "react-icons/fa";

import "./styles/CartPage.css";
import "./styles/global.css";

export default function CartPage() {
  const {
    items,
    addToCart,
    decrementQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
  } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h1>Cart ({totalItems} items)</h1>

      {items.length === 0 ? (
        <p className="empty-message">
          Your cart is empty. <Link to="/">Back to gallery</Link>
        </p>
      ) : (
        <div className="cart-grid">
          {/* Left column: all cart lines */}
          <div className="cart-lines">
            {items.map((item) => {
              const lineSubtotal = item.price * item.quantity;
              return (
                <div key={item.id} className="cart-line">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="line-image"
                  />
                  <div className="line-details">
                    <h2>{item.title}</h2>
                    <p className="line-text">
                      Unit: ${item.price.toFixed(2)}
                    </p>
                    <p className="line-text">
                      Subtotal: ${lineSubtotal.toFixed(2)}
                    </p>
                    <div className="quantity-controls">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          addToCart({
                            id:       item.id,
                            title:    item.title,
                            price:    item.price,
                            imageUrl: item.imageUrl,
                          })
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right column: order summary */}
          <aside className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-line">
              <span>Items:</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-line">
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              disabled={items.length === 0}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
