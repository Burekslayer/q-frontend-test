import React from 'react';
import { useLightboxState, IconButton, createIcon, } from 'yet-another-react-lightbox';


const MyIcon = createIcon("MyIcon", <path d="..." />);


function MyButton() {
  const { currentSlide } = useLightboxState();
  return (
    <IconButton
      label={`Slide ${currentSlide + 1}`} // Example dynamic label
      icon={<MyIcon />} // Replace with your actual icon component
      disabled={currentSlide === undefined || currentSlide === null}
      onClick={() => {
        // Your click handler logic here
        console.log(`Current slide index is ${currentSlide}`);
      }}
    />
  );
}

export default MyButton;
