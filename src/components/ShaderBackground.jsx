import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

const ShaderBackground = () => {
  return (
    <ShaderGradientCanvas
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none'
      }}
      lazyLoad={undefined}
      fov={45}
      pixelDensity={1}
      pointerEvents="none"
    >
      <ShaderGradient
        animate="on"
        type="waterPlane"
        wireframe={false}
        shader="defaults"
        uTime={0.2}
        uSpeed={0.2}
        uStrength={3}
        uDensity={1.8}
        uFrequency={5.5}
        uAmplitude={0}
        positionX={0}
        positionY={-2.1}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={225}
        color1="#8ce96b"
        color2="#062B22"
        color3="#4DA932"
        reflection={0.1}
        cAzimuthAngle={180}
        cPolarAngle={95}
        cDistance={2.4}
        cameraZoom={1}
        lightType="3d"
        brightness={1.2}
        envPreset="city"
        grain="off"
        toggleAxis={undefined}
        zoomOut={undefined}
        hoverState=""
        enableTransition={false}
      />
    </ShaderGradientCanvas>
  );
};

export default ShaderBackground;
