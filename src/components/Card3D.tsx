import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  title: string;
  description: string;
  image: string;
  difficulty: string;
  prepTime: string;
  onClick?: () => void;
}

const Card3D: React.FC<Card3DProps> = ({
  title,
  description,
  image,
  difficulty,
  prepTime,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [glare, setGlare] = useState({ x: 0, y: 0, opacity: 0 });
  
  // Handle mouse move to create 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Scale rotations based on card size (smaller rotation for larger cards)
    const rotateXFactor = 20 / rect.height;
    const rotateYFactor = 20 / rect.width;
    
    // Calculate rotations
    const newRotateX = -mouseY * rotateXFactor;
    const newRotateY = mouseX * rotateYFactor;
    
    // Update glare position
    const glareX = (mouseX / rect.width) * 100 + 50;
    const glareY = (mouseY / rect.height) * 100 + 50;
    
    setRotateX(newRotateX);
    setRotateY(newRotateY);
    setGlare({
      x: glareX,
      y: glareY,
      opacity: 0.2
    });
  };
  
  // Reset transformations on mouse leave
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
    setGlare({ x: 0, y: 0, opacity: 0 });
  };
  
  // Increase scale on mouse enter
  const handleMouseEnter = () => {
    setScale(1.05);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-xl overflow-hidden h-96 w-full cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Main card with 3D rotation */}
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: scale,
          transformStyle: 'preserve-3d',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full h-full bg-white rounded-xl overflow-hidden border border-terracotta/10"
      >
        {/* Card image */}
        <div 
          className="h-3/5 relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Glare effect */}
          <div 
            className="absolute inset-0 bg-gradient-radial pointer-events-none"
            style={{ 
              backgroundImage: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, rgba(255,255,255,0) 70%)`,
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Difficulty badge */}
          <div 
            className="absolute top-4 left-4"
            style={{ transform: 'translateZ(30px)' }}
          >
            <span className="bg-terracotta text-white px-3 py-1 rounded-full text-xs font-medium">
              {difficulty}
            </span>
          </div>
          
          {/* Prep time badge */}
          <div 
            className="absolute top-4 right-4"
            style={{ transform: 'translateZ(30px)' }}
          >
            <span className="bg-navy text-white px-3 py-1 rounded-full text-xs font-medium">
              {prepTime}
            </span>
          </div>
        </div>
        
        {/* Card content */}
        <div 
          className="h-2/5 p-5 flex flex-col justify-between"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div>
            <h3 className="text-xl font-playfair font-bold text-navy line-clamp-1">
              {title}
            </h3>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {description}
            </p>
          </div>
          
          <button 
            className="mt-auto bg-cream text-navy py-2 px-4 rounded-lg font-medium text-sm hover:bg-terracotta hover:text-white transition-colors"
            style={{ transform: 'translateZ(10px)' }}
          >
            View Recipe
          </button>
        </div>
      </motion.div>
      
      {/* Card shadow */}
      <motion.div
        className="absolute inset-0 bg-black/10 rounded-xl -z-10 blur-md"
        style={{
          scale: 0.95,
          rotateX: rotateX * 0.7,
          rotateY: rotateY * 0.7,
          translateY: 15,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </motion.div>
  );
};

export default Card3D; 