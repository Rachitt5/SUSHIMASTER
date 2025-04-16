import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card3D from './Card3D';

// Example recipe data
const trendingRecipes = [
  {
    id: 1,
    title: "Avocado & Salmon Tartare",
    description: "Freshly diced salmon and ripe avocado with a zesty citrus dressing, perfect as an elegant appetizer or light meal.",
    image: "/lovable-uploads/f73573fd-faa6-4fd1-b264-ca1f42832037.png",
    difficulty: "Intermediate",
    prepTime: "20 mins"
  },
  {
    id: 2,
    title: "Mango Sticky Rice",
    description: "Sweet Thai dessert of glutinous rice infused with coconut milk, served with fresh mango slices and a drizzle of coconut sauce.",
    image: "/lovable-uploads/ff1f8e46-3689-4f33-a19d-49a015652c02.png",
    difficulty: "Easy",
    prepTime: "30 mins"
  },
  {
    id: 3,
    title: "Japanese Cucumber Rolls",
    description: "Light and refreshing cucumber-wrapped sushi with cream cheese, smoked salmon and avocado. Perfect for summer gatherings.",
    image: "/lovable-uploads/e3a85ed1-3911-44c7-b5a0-77f780931944.png",
    difficulty: "Intermediate",
    prepTime: "25 mins"
  },
  {
    id: 4,
    title: "Beetroot Carpaccio",
    description: "Thinly sliced roasted beetroot with goat cheese, arugula, and a honey balsamic glaze. A stunning vegetarian appetizer.",
    image: "/lovable-uploads/5211885e-fcac-45aa-8247-8b60e613ef89.png",
    difficulty: "Easy",
    prepTime: "15 mins"
  },
  {
    id: 5,
    title: "Dragon Fruit Bowl",
    description: "Vibrant breakfast bowl with dragon fruit, banana, berries, and granola for a nutritious start to your day.",
    image: "/lovable-uploads/aeca7ad2-25c9-4fb5-9cb6-b717c8890730.png",
    difficulty: "Easy",
    prepTime: "10 mins"
  },
  {
    id: 6,
    title: "Truffle Risotto",
    description: "Creamy Arborio rice slowly cooked with mushrooms and finished with truffle oil for an indulgent dinner option.",
    image: "/lovable-uploads/f977882f-7c7f-4937-a0fb-dda5670df3af.png",
    difficulty: "Advanced",
    prepTime: "40 mins"
  }
];

// 3D Carousel component for recipe display
const TrendingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle next slide
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % trendingRecipes.length);
  };
  
  // Handle previous slide
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + trendingRecipes.length) % trendingRecipes.length);
  };
  
  // Handle user interaction - pause autoplay
  const handleInteraction = () => {
    setAutoplay(false);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    
    // Resume autoplay after 10 seconds of inactivity
    const timeout = setTimeout(() => {
      setAutoplay(true);
    }, 10000);
    
    return () => clearTimeout(timeout);
  };
  
  // Autoplay functionality
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentIndex]);
  
  // Calculate visible recipes
  const getVisibleRecipes = () => {
    const recipes = [];
    
    // Current recipe
    recipes.push({
      ...trendingRecipes[currentIndex],
      position: 'center'
    });
    
    // Previous recipe (left)
    const prevIndex = (currentIndex - 1 + trendingRecipes.length) % trendingRecipes.length;
    recipes.push({
      ...trendingRecipes[prevIndex],
      position: 'left'
    });
    
    // Next recipe (right)
    const nextIndex = (currentIndex + 1) % trendingRecipes.length;
    recipes.push({
      ...trendingRecipes[nextIndex],
      position: 'right'
    });
    
    return recipes;
  };
  
  const visibleRecipes = getVisibleRecipes();
  
  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
      zIndex: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -45 : 45,
      zIndex: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    })
  };
  
  return (
    <div className="relative py-16 bg-gradient-to-b from-navy to-navy/90 text-white">
      <div 
        className="container mx-auto px-4"
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-playfair font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Trending Recipes
        </motion.h2>
        
        <motion.p 
          className="text-center text-xl text-terracotta max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore our most popular culinary creations
        </motion.p>
        
        {/* 3D Carousel container */}
        <div className="relative h-[500px] overflow-hidden perspective">
          {/* Reflective floor effect */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-navy/40 to-transparent"></div>
          
          {/* Carousel */}
          <div className="relative w-full h-full">
            <AnimatePresence custom={direction} initial={false}>
              {visibleRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate={recipe.position === 'center' ? 'center' : (recipe.position === 'left' ? { x: -400, opacity: 0.5, scale: 0.8, rotateY: 15, zIndex: 5 } : { x: 400, opacity: 0.5, scale: 0.8, rotateY: -15, zIndex: 5 })}
                  exit="exit"
                  className="absolute top-0 left-0 right-0 max-w-lg mx-auto"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                  }}
                >
                  <Card3D
                    title={recipe.title}
                    description={recipe.description}
                    image={recipe.image}
                    difficulty={recipe.difficulty}
                    prepTime={recipe.prepTime}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Navigation controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6 z-20">
            <motion.button
              className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-terracotta transition-colors"
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            
            {/* Indicators */}
            <div className="flex space-x-2">
              {trendingRecipes.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-terracotta' : 'bg-white/30'}`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                    handleInteraction();
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={index === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                  transition={index === currentIndex ? { repeat: Infinity, duration: 2 } : {}}
                />
              ))}
            </div>
            
            <motion.button
              className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-terracotta transition-colors"
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-terracotta/10 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-terracotta/10 blur-3xl"></div>
    </div>
  );
};

export default TrendingCarousel; 