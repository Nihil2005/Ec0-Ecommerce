import React from 'react';

const Banner2 = () => {
  return (
    <div className="relative bg-cover bg-center h-96">
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary opacity-50"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <video
          className="w-full h-auto max-w-2xl"
          controls
          controlsList="nodownload"
          muted  // Mute the video to hide sound slider in full-screen mode
          loop  // Loop the video for continuous playback
          autoPlay  // Start playing the video automatically
        >
          <source src="src\assets\Untitled video - Made with Clipchamp.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Banner2;
