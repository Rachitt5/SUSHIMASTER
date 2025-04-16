import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollProgressBar = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Convert scroll progress to CSS width percentage
  const scaleX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Create gradient color based on scroll progress
  const gradient = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "linear-gradient(to right, #E07A5F, #E07A5F)",
      "linear-gradient(to right, #E07A5F, #81B29A)",
      "linear-gradient(to right, #81B29A, #3D405B)",
    ]
  );

  // Background style combining gradient and scaleX
  const style = {
    scaleX,
    background: gradient
  };

  // Make scroll-to-top button visible after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Fixed progress bar at the top of the viewport */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-2 z-50 origin-left bg-gray-200"
        style={style}
      />
      
      {/* Scroll to top button with animation */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-white text-terracotta p-3 rounded-full shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0px 10px 25px rgba(0,0,0,0.15)"
        }}
      >
        <ArrowUp size={24} />
        
        {/* Animated ring around the button */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-terracotta"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </motion.button>
      
      {/* Progress indicator at the bottom right */}
      <motion.div 
        className="fixed bottom-8 left-8 z-50 bg-white rounded-full p-3 shadow-lg font-bold text-navy flex items-center justify-center w-14 h-14"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 20
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div>
          {/* Show percentage scrolled */}
          <motion.span>
            {useTransform(scrollYProgress, (value) => `${Math.round(value * 100)}%`)}
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ScrollProgressBar; 