import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Create parallax effect for scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  
  // Calculate mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center
    const x = (e.clientX - centerX) / 50;
    const y = (e.clientY - centerY) / 50;
    
    setMousePosition({ x, y });
  };
  
  // React spring animation config for mouse-based parallax
  const springConfig = { mass: 10, tension: 350, friction: 80 };
  
  // Apply spring physics to movement for smoother effect
  const titleSpring = useSpring({
    transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) scale(1.05)`,
    config: springConfig
  });
  
  const imageSpring = useSpring({
    transform: `perspective(1000px) translateX(${-mousePosition.x * 2}px) translateY(${-mousePosition.y * 2}px)`,
    config: springConfig
  });
  
  const bgShapeSpring1 = useSpring({
    transform: `translateX(${mousePosition.x * 15}px) translateY(${mousePosition.y * 15}px) rotate(${mousePosition.x}deg)`,
    config: springConfig
  });
  
  const bgShapeSpring2 = useSpring({
    transform: `translateX(${-mousePosition.x * 10}px) translateY(${-mousePosition.y * 10}px) rotate(${-mousePosition.y}deg)`,
    config: springConfig
  });
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  // If loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  return (
    <motion.div
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy via-navy/90 to-navy/80 text-white"
      onMouseMove={handleMouseMove}
      style={{ opacity: heroOpacity, y: heroY }}
    >
      {/* Abstract background shapes */}
      <animated.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-terracotta/20 blur-3xl"
        style={bgShapeSpring1}
      />
      <animated.div 
        className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-sage/20 blur-3xl"
        style={bgShapeSpring2}
      />
      
      {/* Particle overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
      
      {/* Content container */}
      <div className="container mx-auto px-4 h-screen flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content with 3D parallax */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <animated.div style={titleSpring}>
              <motion.span variants={itemVariants} className="inline-block text-lg md:text-xl text-terracotta font-medium mb-4">
                Welcome to Culinary Canvas
              </motion.span>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-playfair font-bold mb-8 text-white leading-tight">
                Crafting Visual <br />
                <span className="text-terracotta">Gastronomic</span> Stories
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl">
                Where art meets cuisine. Explore immersive culinary experiences through our creative recipes and visual storytelling.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#de5d3a' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors"
                >
                  Explore Recipes
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-medium border border-white/20 transition-colors"
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </animated.div>
          </motion.div>
          
          {/* 3D Image container */}
          <div className="hidden lg:block">
            <animated.div 
              style={imageSpring}
              className="relative w-full aspect-square"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 100, 
                  delay: 0.8,
                  duration: 1.5 
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Main dish image */}
                <div className="absolute inset-10 flex items-center justify-center">
                  <div className="w-full aspect-square relative rounded-full overflow-hidden p-8 border-8 border-white/10 shadow-2xl transform-style-3d">
                    <img 
                      src="/lovable-uploads/f19b950a-5a87-4648-be41-94416d57778e.png" 
                      alt="Culinary Masterpiece" 
                      className="w-full h-full object-cover rounded-full object-center" 
                    />
                    
                    {/* Floating ingredient elements */}
                    <motion.div 
                      className="absolute -top-16 -right-16 w-32 h-32 p-2 bg-white rounded-full shadow-xl"
                      animate={{ 
                        y: [0, -10, 0], 
                        rotate: [0, 5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    >
                      <img 
                        src="/lovable-uploads/3c74466f-d8a5-4966-b3a5-ccd702527151.png" 
                        alt="Avocado" 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="absolute -bottom-8 left-12 w-24 h-24 p-2 bg-white rounded-full shadow-xl"
                      animate={{ 
                        y: [0, 10, 0], 
                        rotate: [0, -5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                    >
                      <img 
                        src="public/lovable-uploads/5211885e-fcac-45aa-8247-8b60e613ef89.png" 
                        alt="Salmon" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="absolute -left-12 top-1/4 w-20 h-20 p-2 bg-white rounded-full shadow-xl"
                      animate={{ 
                        y: [0, -8, 0], 
                        rotate: [0, 8, 0], 
                      }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                    >
                      <img 
                        src="public/lovable-uploads/413b37fb-4855-4e89-b541-eff3883bd185.png" 
                        alt="Spice" 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </motion.div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent rounded-full mix-blend-overlay"></div>
                  </div>
                </div>
              </motion.div>
            </animated.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white/70 mb-2 text-sm">Scroll to explore</span>
            <ArrowDown className="h-6 w-6 text-terracotta animate-pulse" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection; 