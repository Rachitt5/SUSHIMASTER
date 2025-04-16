import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// Custom hook for parallax effect
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// Individual image card with parallax effect
const ParallaxImage = ({ 
  src, 
  alt, 
  index, 
  progress, 
  count 
}: { 
  src: string; 
  alt: string; 
  index: number; 
  progress: MotionValue<number>;
  count: number;
}) => {
  const ref = useRef(null);
  
  // Calculate different parallax values based on image index
  const distance = 100 + (index * 50);
  const rotateZ = useTransform(progress, [0, 1], [0, index % 2 === 0 ? 5 : -5]);
  const y = useParallax(progress, distance);
  const scale = useTransform(progress, [0, 1], [0.9, 1 + (index * 0.05)]);
  const opacity = useTransform(progress, [0, 0.5, 1], [0.3, 1, 0.3]);
  
  // Calculate grid positions
  const gridColumns = 12;
  const gridPosition = index % 3;
  const columnStart = gridPosition === 0 ? 2 : gridPosition === 1 ? 5 : 8;
  
  return (
    <motion.div
      ref={ref}
      style={{
        y,
        rotateZ,
        scale,
        opacity,
        gridColumn: `${columnStart} / span 3`,
        gridRow: `${Math.floor(index / 3) + 1}`,
      }}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl mb-40"
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-playfair text-xl font-bold">
            {alt}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

const ParallaxGallery = () => {
  const { scrollYProgress } = useScroll();
  const ref = useRef(null);

  // Sample gallery images
  const galleryImages = [
    { src: "public/lovable-uploads/f977882f-7c7f-4937-a0fb-dda5670df3af.png", alt: "Seafood Delight" },
    { src: "public/lovable-uploads/f73573fd-faa6-4fd1-b264-ca1f42832037.png", alt: "Salmon Tartare" },
    { src: "public/lovable-uploads/ff1f8e46-3689-4f33-a19d-49a015652c02.png", alt: "Avocado Roll" },
    { src: "public/lovable-uploads/e3a85ed1-3911-44c7-b5a0-77f780931944.png", alt: "Signature Sushi" },
    { src: "public/lovable-uploads/a0fa9695-3ec8-4b18-bc49-ca77079b8dff.png", alt: "Cucumber Roll" },
    { src: "public/lovable-uploads/5ee877b9-f3e0-4d4e-b4a3-05ea756162c5.png", alt: "Rice Bowl" },
    { src: "public/lovable-uploads/2511b0b2-659a-497a-b373-3157d8548b59.png", alt: "Ginger Tempura" },
    { src: "public/lovable-uploads/aeca7ad2-25c9-4fb5-9cb6-b717c8890730.png", alt: "Dragon Roll" },
    { src: "public/lovable-uploads/00c36de8-fb31-4e61-b0fc-2e3c3f02bf02.png", alt: "Wasabi Special" },
  ];

  return (
    <div className="relative py-24 bg-gradient-to-b from-white to-cream overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-playfair font-bold text-center mb-16 text-navy"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Culinary Gallery
        </motion.h2>

        {/* Parallax grid layout */}
        <div 
          ref={ref}
          className="grid grid-cols-12 gap-5 min-h-[150vh]"
        >
          {galleryImages.map((image, index) => (
            <ParallaxImage
              key={index}
              src={image.src}
              alt={image.alt}
              index={index}
              progress={scrollYProgress}
              count={galleryImages.length}
            />
          ))}
        </div>
        
        {/* Floating gradient shapes for visual enhancement */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-terracotta/20 blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-sage/20 blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-72 h-72 rounded-full bg-navy/10 blur-3xl -z-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default ParallaxGallery; 