import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import {
  CircleDashed as CircleNotch,
  Plus,
  Minus,
  Leaf,
  Fish,
  Carrot,
  Grains,
  Plant,      // Using Plant instead of Radish
  FlowerLotus
} from '@phosphor-icons/react';

type Ingredient = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  layerIndex: number;
};

// Interactive Food Customizer Component with drag-and-drop ingredients
const FoodCustomizer = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [activeIngredient, setActiveIngredient] = useState<string | null>(null);
  const [plateRotation, setPlateRotation] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const plateRef = useRef<HTMLDivElement>(null);

  // Available ingredients palette
  const ingredientPalette: Omit<Ingredient, 'x' | 'y' | 'rotation' | 'scale' | 'layerIndex'>[] = [
    { id: 'rice', name: 'Rice', icon: <Grains weight="fill" />, color: '#fffbe6' },
    { id: 'salmon', name: 'Salmon', icon: <Fish weight="fill" />, color: '#ff8370' },
    { id: 'tuna', name: 'Tuna', icon: <Fish weight="fill" />, color: '#e14b4b' },
    { id: 'avocado', name: 'Avocado', icon: <Leaf weight="fill" />, color: '#78c850' },
    { id: 'cucumber', name: 'Cucumber', icon: <Plant weight="fill" />, color: '#67c587' },  // Use Plant
    { id: 'wasabi', name: 'Wasabi', icon: <CircleNotch weight="fill" />, color: '#a0e878' },
    { id: 'ginger', name: 'Ginger', icon: <FlowerLotus weight="fill" />, color: '#f8c3b9' },
  ];

  // Plate rotation animation
  const plateSpring = useSpring({
    transform: `rotate(${plateRotation}deg)`,
    config: { mass: 2, tension: 170, friction: 26 }
  });

  // Handle adding a new ingredient to the plate
  const addIngredient = (ingredientType: string) => {
    const baseIngredient = ingredientPalette.find(i => i.id === ingredientType);
    if (!baseIngredient) return;
    
    // Get random position within the plate
    const plateSize = plateRef.current?.getBoundingClientRect() || { width: 300, height: 300 };
    const plateRadius = Math.min(plateSize.width, plateSize.height) / 2;
    
    // Create position within the circle (plate)
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (plateRadius * 0.6);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    const newIngredient: Ingredient = {
      ...baseIngredient,
      x,
      y,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4,
      layerIndex: ingredients.length,
    };
    
    setIngredients([...ingredients, newIngredient]);
    setActiveIngredient(newIngredient.id + ingredients.length);
  };

  // Handle ingredient drag
  const handleDrag = (e: React.MouseEvent, index: number) => {
    if (!plateRef.current) return;
    
    const plate = plateRef.current.getBoundingClientRect();
    const plateCenter = {
      x: plate.left + plate.width / 2,
      y: plate.top + plate.height / 2
    };
    
    // Calculate new position relative to plate center
    const newX = e.clientX - plateCenter.x;
    const newY = e.clientY - plateCenter.y;
    
    // Update ingredient position
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      x: newX,
      y: newY,
    };
    
    setIngredients(updatedIngredients);
  };

  // Handle plate rotation
  const rotatePlate = (direction: 'left' | 'right') => {
    const rotationAmount = direction === 'left' ? -45 : 45;
    setPlateRotation(plateRotation + rotationAmount);
  };

  // Clear instructions after some time
  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showInstructions]);

  return (
    <div className="bg-gradient-to-b from-cream to-white p-6 rounded-xl shadow-xl">
      <h2 className="text-3xl font-playfair font-bold text-navy text-center mb-6">
        Create Your Masterpiece
      </h2>
      
      {/* Instructions toast */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-navy/90 text-white p-4 rounded-lg mb-6 text-center"
          >
            <p>Drag ingredients onto the plate to create your custom dish!</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Plate rotation controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={() => rotatePlate('left')}
          className="bg-terracotta text-white p-3 rounded-full hover:bg-terracotta/90 transition-colors"
        >
          <Minus size={24} weight="bold" />
        </button>
        
        <button 
          onClick={() => rotatePlate('right')}
          className="bg-terracotta text-white p-3 rounded-full hover:bg-terracotta/90 transition-colors"
        >
          <Plus size={24} weight="bold" />
        </button>
      </div>
      
      {/* Plate with ingredients */}
      <div className="relative w-full max-w-sm mx-auto aspect-square mb-8">
        <animated.div 
          ref={plateRef}
          style={plateSpring}
          className="absolute inset-0 rounded-full bg-white border-4 border-terracotta/20 shadow-lg"
        >
          {/* Render ingredients on the plate */}
          {ingredients.map((ingredient, index) => (
            <motion.div
              key={ingredient.id + index}
              initial={{ scale: 0 }}
              animate={{ 
                scale: ingredient.scale,
                rotate: ingredient.rotation,
                zIndex: activeIngredient === ingredient.id + index ? 50 : ingredient.layerIndex
              }}
              whileHover={{ scale: ingredient.scale * 1.1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{ 
                backgroundColor: ingredient.color,
                position: 'absolute',
                left: `calc(50% + ${ingredient.x}px)`,
                top: `calc(50% + ${ingredient.y}px)`,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transform: `translate(-50%, -50%) rotate(${ingredient.rotation}deg) scale(${ingredient.scale})`,
              }}
              onMouseDown={() => setActiveIngredient(ingredient.id + index)}
              onMouseUp={() => setActiveIngredient(null)}
              onMouseMove={(e) => activeIngredient === ingredient.id + index && handleDrag(e, index)}
              className="touch-none select-none"
            >
              <div className="text-white scale-125">
                {ingredient.icon}
              </div>
            </motion.div>
          ))}
          
          {/* Plate decoration */}
          <div className="absolute inset-5 rounded-full border border-gray-200"></div>
          <div className="absolute inset-20 rounded-full border border-gray-100"></div>
        </animated.div>
      </div>
      
      {/* Ingredient palette */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-navy mb-3">Ingredients</h3>
        <div className="grid grid-cols-4 gap-3">
          {ingredientPalette.map((ingredient) => (
            <motion.button
              key={ingredient.id}
              onClick={() => addIngredient(ingredient.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-cream hover:bg-terracotta/10 transition-colors"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                style={{ backgroundColor: ingredient.color }}
              >
                <div className="text-white text-xl">
                  {ingredient.icon}
                </div>
              </div>
              <span className="text-xs text-navy font-medium">{ingredient.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Action button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={() => setIngredients([])}
          className="bg-navy text-white px-6 py-2 rounded-full hover:bg-navy/90 transition-colors"
        >
          Reset Plate
        </button>
      </div>
    </div>
  );
};

export default FoodCustomizer; 