import { useState } from 'react';

const useHoverAnimation = (duration = 2800) => {
  // "": no animation, "animate": forward, "animate-reverse": reverse
  const [animationState, setAnimationState] = useState("");

  const handleMouseEnter = () => setAnimationState("animate");

  const handleMouseLeave = () => {
    setAnimationState("animate-reverse");
    // Optionally reset to no animation after the reverse animation finishes:
    //setTimeout(() => setAnimationState(""), duration);
  };

  return { animationState, handleMouseEnter, handleMouseLeave };
};

export default useHoverAnimation;