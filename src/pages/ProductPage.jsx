// CartPage.jsx
import { useState, useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../pages/styles/ProductPage.css";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

function extractPublicId(cloudinaryUrl) {
  const m = cloudinaryUrl.match(
    /\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif)$/
  );
  return m ? m[1] : null;
}

// helper to build your mockup URL
function makeMockupUrl(
  baseTemplateId,
  paintingPublicId,
  {
    width = 300,
    baseMax = 1000,
    gravity = "center",
    offsetX = 0,
    offsetY = 0,
  } = {}
) {
  // baseTemplateId e.g. "templates/living_room_2"
  // paintingPublicId e.g. "paintings/putvaceg3vso0sbnjic9"
  return [
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`,
    `c_limit,w_${baseMax},h_${baseMax}`,
    `l_${baseTemplateId},fl_layer_apply`,
    `w_${width},c_scale`,
    `g_${gravity},x_${offsetX},y_${offsetY}`,
    `${paintingPublicId}.jpg`,
  ].join("/");
}
// https://res.cloudinary.com/dn30aabyv/image/upload/v1747224202/templates/living_room.jpg
export default function ProductPage() {
  const { state } = useLocation();
  const { productItem } = state; // your painting object
  const { src, price, alt, id } = productItem;
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [showCartPrompt, setShowCartPrompt] = useState(false);
  console.log(id)
  const publicId = useMemo(() => extractPublicId(src), [src]);

  console.log(publicId);

  // define your templates once
  const mockupTemplates = useMemo(
    () => [
      "templates/living_room",
      "templates/living_room_2",
      "templates/studio_wall",
    ],
    []
  );

  // build your shots array: bare + each template
  const shots = useMemo(() => {
    if (!publicId) return [src];
    return [
      src,
      // living_room: centered, but nudged down 100px
      makeMockupUrl(publicId, mockupTemplates[0], {
        overlayW: 200,
        gravity: "north",
        offsetX: 0,
        offsetY: 100,
      }),
      // second mockup: pin to top-right, move left 50px
      makeMockupUrl(publicId, mockupTemplates[1], {
        overlayW: 600,
        gravity: "north_east",
        offsetX: -50,
        offsetY: 0,
      }),
      // studio wall: default center
      makeMockupUrl(publicId, mockupTemplates[2], {
        overlayW: 800,
      }),
    ];
  }, [src, publicId]);

  function handleAddToCart() {
    addToCart({
      id: id,
      alt: alt,
      price: price,
      imageUrl: src,
    });
    setShowCartPrompt(true);
  }

  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="product-page">
      <div className="top-info"></div>
      <div className="product-section">
        <div className="item-images">
          <div className="thumbnails">
            {shots.map((src, i) => (
              <img
                key={i}
                src={src}
                className={i === selectedIdx ? "thumb selected" : "thumb"}
                onClick={() => setSelectedIdx(i)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={shots[selectedIdx]} alt={"nema gi"} />
          </div>
        </div>
        <div className="item-details">
          <button className="cart-button" onClick={handleAddToCart}>
            <a href='#' className="figma-button-test">
              <span className="figma-button-test-text">Add to cart</span>
            </a>
          </button>

          {/* overlay + drawer */}
          <div
            className={`cart-overlay ${showCartPrompt ? "show" : ""}`}
            onClick={() => setShowCartPrompt(false)}
          />
          <div className={`cart-panel ${showCartPrompt ? "show" : ""}`}>
            <p>✔️ Item added to cart!</p>
            <div className="cart-panel-buttons">
              <button onClick={() => navigate("/cart")}>Proceed to Cart</button>
              <button onClick={() => setShowCartPrompt(false)}>
                Continue Admiring
              </button>
            </div>
          </div>

          <p>{price}</p>
        </div>
      </div>
    </div>
  );
}
