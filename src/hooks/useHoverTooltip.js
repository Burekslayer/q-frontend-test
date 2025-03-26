// src/hooks/useHoverTooltip.js
import { useState } from "react";

const useHoverTooltip = () => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });


  const handleMouseMove = (e, content) => {
    setTooltip((prev) => ({
      ...prev,
      visible: true,
      content,
      x: e.clientX + 15,
      y: e.clientY + 15,
    }));
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: "", x: 0, y: 0 });
  };

  return { tooltip, handleMouseMove, handleMouseLeave };
};

export default useHoverTooltip;
