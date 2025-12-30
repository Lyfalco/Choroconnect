import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseStyle = "px-8 py-3 rounded-full font-light tracking-widest uppercase transition-all duration-300 backdrop-blur-sm";
  
  const variants = {
    primary: "border border-chrono-neonBlue text-white hover:bg-chrono-neonBlue/10 hover:shadow-neon-blue",
    secondary: "border border-chrono-neonPink text-white hover:bg-chrono-neonPink/10 hover:shadow-neon-pink"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
