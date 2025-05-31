// src/pages/CheckoutPage.jsx

import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import "./styles/CheckoutPage.css";

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-section">
      <button onClick={() => setOpen((o) => !o)} className="accordion-header">
        <span>{title}</span>
        <FaChevronDown className={open ? "rotate-180" : ""} />
      </button>
      <div className={`accordion-content${open ? " show" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useContext(CartContext);
  console.log(items);
  // Buyer email state
  const [buyerEmail, setBuyerEmail] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postal: "",
    country: "",
  });

  // Payment method state (example fields; adjust if needed)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Helper to update shippingAddress fields
  function handleAddressChange(field, value) {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }

  // Helper to update paymentInfo fields
  function handlePaymentChange(field, value) {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  }

  // When “Place Order” is clicked
  async function handlePlaceOrder() {
    // Basic validation
    if (!buyerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    // You can add more validation for shippingAddress/paymentInfo here

    // Build payload
    const payload = {
      buyerEmail,
      shippingAddress,
      paymentInfo,
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      totalPrice,
    };
    try {
      await axios.post(`${apiUrl}/api/orders`, payload);
      clearCart();
      alert("Order placed! A confirmation email has been sent.");
    } catch (err) {
      console.error("Order submission error:", err);
      alert("Failed to place order. Please try again later.");
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <Accordion title="Already have an account?">
        <p>Log in for a faster checkout.</p>
        <button className="login-btn">Log In</button>
      </Accordion>

      <Accordion title={`In Your Cart (${totalItems} items)`}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-2"
            style={{ marginBottom: "0.5rem" }}
          >
            <span>{item.title}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <p className="font-bold">Subtotal: ${totalPrice.toFixed(2)}</p>
      </Accordion>

      <Accordion title="Shipping Address">
        <div className="two-column">
          <input
            type="text"
            placeholder="First Name"
            value={shippingAddress.firstName}
            onChange={(e) => handleAddressChange("firstName", e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={shippingAddress.lastName}
            onChange={(e) => handleAddressChange("lastName", e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Street Address"
          value={shippingAddress.street}
          onChange={(e) => handleAddressChange("street", e.target.value)}
        />
        <div className="two-column">
          <input
            type="text"
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={shippingAddress.postal}
            onChange={(e) => handleAddressChange("postal", e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={(e) => handleAddressChange("country", e.target.value)}
        />
      </Accordion>

      <Accordion title="Payment Method">
        <input
          type="text"
          placeholder="Card Number"
          value={paymentInfo.cardNumber}
          onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
        />
        <div className="two-column">
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            value={paymentInfo.expiryDate}
            onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            value={paymentInfo.cvv}
            onChange={(e) => handlePaymentChange("cvv", e.target.value)}
          />
        </div>
      </Accordion>

      {/* Buyer Email Field */}
      <div className="email-field">
        <label htmlFor="buyerEmail">Email Address</label>
        <input
          id="buyerEmail"
          type="email"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <aside className="checkout-summary">
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
          onClick={handlePlaceOrder}
          className="place-order-btn"
          disabled={items.length === 0}
        >
          Place Order
        </button>
      </aside>
    </div>
  );
}
