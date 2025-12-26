// src/pages/CheckoutPage.jsx

import { useContext, useMemo, useRef, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "./styles/CheckoutPage.css";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useContext(CartContext);

  const [buyerEmail, setBuyerEmail] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postal: "",
    country: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Section open / saved state
  const [cartOpen, setCartOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [shippingSaved, setShippingSaved] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);

  const [shippingMethod, setShippingMethod] = useState("included");

  const formRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Simple pricing model similar conceptually to Saatchi
  const SHIPPING_RATES = {
    included: 0,
    express: 25,
  };

  const { subtotal, shippingCost, finalTotal } = useMemo(() => {
    const sub = totalPrice || 0;
    const ship = SHIPPING_RATES[shippingMethod] ?? 0;
    const total = sub + ship;

    return {
      subtotal: sub,
      shippingCost: ship,
      finalTotal: total,
    };
  }, [totalPrice, shippingMethod]);

  function handleAddressChange(field, value) {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }

  function handlePaymentChange(field, value) {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  }

  function validateShipping() {
    const required = [
      "firstName",
      "lastName",
      "street",
      "city",
      "postal",
      "country",
    ];

    for (const key of required) {
      if (!shippingAddress[key].trim()) {
        alert("Please fill in all required shipping fields.");
        return false;
      }
    }
    return true;
  }

  function validatePayment() {
    if (!paymentInfo.cardNumber.trim()) {
      alert("Please enter a card number (demo only).");
      return false;
    }
    if (!paymentInfo.expiryDate.trim()) {
      alert("Please enter card expiry date.");
      return false;
    }
    if (!paymentInfo.cvv.trim()) {
      alert("Please enter CVV.");
      return false;
    }
    return true;
  }

  function validateEmail() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(buyerEmail)) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;
  }

  function handleSaveShipping() {
    if (!validateShipping()) return;
    setShippingSaved(true);
    setShippingOpen(false);
    setPaymentOpen(true);
  }

  function handleSavePayment() {
    if (!validatePayment()) return;
    setPaymentSaved(true);
    setPaymentOpen(false);
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();

    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }
    if (!validateEmail()) return;
    if (!validateShipping()) {
      setShippingOpen(true);
      return;
    }
    if (!validatePayment()) {
      setPaymentOpen(true);
      return;
    }

    const payload = {
      buyerEmail,
      shippingAddress,
      paymentInfo,
      shippingMethod,
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      shippingCost,
      total: finalTotal,
    };

    try {
      await axios.post(`${apiUrl}/api/orders`, payload);
      clearCart();
      alert("Order placed! A confirmation email has been sent.");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing your order.");
    }
  }

  function triggerSubmit() {
    if (formRef.current && typeof formRef.current.requestSubmit === "function") {
      formRef.current.requestSubmit();
    } else if (formRef.current) {
      // Fallback
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        {/* LEFT: FORM */}
        <form
          ref={formRef}
          className="checkout-left"
          onSubmit={handlePlaceOrder}
        >
          {/* Top header card: Checkout + login */}
          <div className="checkout-card header-card">
            <div className="header-row">
              <div>
                <p className="header-title">Checkout</p>
                <p className="header-subtitle">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      // just navigate or open login modal in the future
                      alert("Login flow not implemented in this demo.");
                    }}
                  >
                    Log in for a faster checkout.
                  </button>
                </p>
              </div>
              <button
                type="button"
                className="outlined-small"
                onClick={() => {
                  alert("Login flow not implemented in this demo.");
                }}
              >
                Log In
              </button>
            </div>
          </div>

          {/* In Your Cart section */}
          <div className="checkout-card">
            <button
              type="button"
              className="section-toggle"
              onClick={() => setCartOpen((o) => !o)}
            >
              <div>
                <span className="section-title">In Your Cart</span>
                <span className="section-subtitle">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
              {cartOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {cartOpen && (
              <div className="section-body">
                {items.map((item) => (
                  <div className="cart-preview" key={item.id}>
                    <div className="preview-thumb">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} />
                      )}
                    </div>
                    <div className="preview-info">
                      <p className="preview-title">{item.title}</p>
                      {item.artistName && (
                        <p className="preview-meta">{item.artistName}</p>
                      )}
                      <p className="preview-meta">Artwork total</p>
                    </div>
                    <div className="preview-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Address section */}
          <div className="checkout-card">
            <button
              type="button"
              className="section-toggle"
              onClick={() => setShippingOpen((o) => !o)}
            >
              <div>
                <span className="section-title">Shipping Address</span>
                {shippingSaved && (
                  <span className="section-subtitle">
                    {shippingAddress.firstName} {shippingAddress.lastName},{" "}
                    {shippingAddress.city}, {shippingAddress.country}
                  </span>
                )}
              </div>
              {shippingOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {shippingOpen && (
              <div className="section-body">
                <div className="field-row">
                  <div className="field-group">
                    <label>First Name*</label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        handleAddressChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Last Name*</label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        handleAddressChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Street Address*</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                  />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label>City*</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Postal Code*</label>
                    <input
                      type="text"
                      value={shippingAddress.postal}
                      onChange={(e) =>
                        handleAddressChange("postal", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Country*</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                  />
                </div>

                <button
                  type="button"
                  className="primary-block-button"
                  onClick={handleSaveShipping}
                >
                  Save Shipping Address
                </button>
              </div>
            )}
          </div>

          {/* Payment Method section */}
          <div className="checkout-card">
            <button
              type="button"
              className="section-toggle"
              onClick={() => setPaymentOpen((o) => !o)}
            >
              <div>
                <span className="section-title">Payment Method</span>
                {paymentSaved && (
                  <span className="section-subtitle">
                    Card ending in{" "}
                    {paymentInfo.cardNumber.slice(-4) || "••••"}
                  </span>
                )}
              </div>
              {paymentOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {paymentOpen && (
              <div className="section-body">
                <div className="field-group">
                  <label>Email for receipt*</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="field-group">
                  <label>Card Number*</label>
                  <input
                    type="text"
                    value={paymentInfo.cardNumber}
                    onChange={(e) =>
                      handlePaymentChange("cardNumber", e.target.value)
                    }
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label>Expiry Date*</label>
                    <input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        handlePaymentChange("expiryDate", e.target.value)
                      }
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="field-group">
                    <label>CVV*</label>
                    <input
                      type="text"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        handlePaymentChange("cvv", e.target.value)
                      }
                      placeholder="123"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-block-button subtle"
                  onClick={handleSavePayment}
                >
                  Save Payment Method
                </button>
              </div>
            )}
          </div>

          {/* Bottom PLACE ORDER bar inside form */}
          <button
            type="submit"
            className="place-order-bar"
            disabled={!items.length}
          >
            Place Order
          </button>
        </form>

        {/* RIGHT: ORDER SUMMARY + BENEFITS */}
        <aside className="checkout-right">
          {/* Summary card */}
          <div className="summary-card">
            <h2>Order Summary</h2>

            {items[0] && (
              <div className="summary-art">
                {items[0].imageUrl && (
                  <img src={items[0].imageUrl} alt={items[0].title} />
                )}
                <div>
                  <p className="art-title">{items[0].title}</p>
                  {items[0].artistName && (
                    <p className="art-meta">{items[0].artistName}</p>
                  )}
                  <p className="art-meta">Artwork total</p>
                </div>
              </div>
            )}

            <div className="summary-line">
              <span>Artwork total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>
                {shippingMethod === "included"
                  ? "Included"
                  : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="shipping-methods">
              <label>
                <input
                  type="radio"
                  name="shipping"
                  value="included"
                  checked={shippingMethod === "included"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                Standard shipping (included)
              </label>
              <label>
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shippingMethod === "express"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                Express shipping (+$25.00)
              </label>
            </div>

            <div className="summary-line total">
              <span>Estimated total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            {/* Second Place Order button that submits the same form */}
            <button
              type="button"
              className="place-order-btn"
              disabled={!items.length}
              onClick={triggerSubmit}
            >
              Place Order
            </button>
          </div>

          {/* Benefits card */}
          <div className="benefits-card">
            <h3>Why collectors trust our studio</h3>
            <ul>
              <li>
                <strong>No surprise fees.</strong> The total you see here is
                exactly what you&apos;ll pay.
              </li>
              <li>
                <strong>Careful packaging.</strong> Every artwork is wrapped and
                protected for the journey.
              </li>
              <li>
                <strong>Secure checkout.</strong> Your payment details are
                encrypted end-to-end.
              </li>
              <li>
                <strong>Support artists directly.</strong> Each purchase helps
                our studio continue creating.
              </li>
            </ul>
          </div>

          {/* Help card */}
          <div className="help-card">
            <h3>Need help?</h3>
            <p>
              If you have questions about shipping, payment, or the artwork
              itself, we&apos;re here to help.
            </p>
            <div className="help-actions">
              <button
                type="button"
                className="secondary-outline"
                onClick={() =>
                  alert("Contact form not implemented in this demo.")
                }
              >
                Contact the studio
              </button>
              <button
                type="button"
                className="secondary-outline"
                onClick={() =>
                  alert("Support channel not implemented in this demo.")
                }
              >
                Customer support
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
