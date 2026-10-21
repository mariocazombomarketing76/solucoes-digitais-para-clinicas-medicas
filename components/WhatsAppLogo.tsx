import React from 'react';

interface WhatsAppLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const WhatsAppLogo: React.FC<WhatsAppLogoProps> = ({
  className = "w-5 h-5",
  size,
  alt = "WhatsApp"
}) => {
  return (
    <img
      src="/whatsapp-logo.png"
      alt={alt}
      className={`inline-block object-contain shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
      draggable={false}
    />
  );
};

export default WhatsAppLogo;
