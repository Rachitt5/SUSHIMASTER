import React, { useRef, useEffect } from 'react';

// Interactive animated background with food-themed particles
const AnimatedBackground = ({ color = '#E07A5F20' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Define particle shapes - food-themed abstract shapes
    const foodShapes = [
      (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
        // Circle/plate
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      },
      (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
        // Triangle/slice
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },
      (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
        // Rounded square/bread
        ctx.beginPath();
        ctx.roundRect(x - size, y - size, size * 2, size * 2, size / 2);
        ctx.fill();
        ctx.stroke();
      },
      (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
        // Leaf shape 
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 1.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      },
      (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
        // Star/garnish
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size / 2;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI * i) / spikes;
          const x2 = x + Math.cos(angle) * radius;
          const y2 = y + Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x2, y2);
          } else {
            ctx.lineTo(x2, y2);
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    ];
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      shapeIndex: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 10 + 5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.shapeIndex = Math.floor(Math.random() * foodShapes.length);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = 0.1 + Math.random() * 0.3;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        // Wrap around edges
        if (this.x < -this.size * 2) this.x = canvas.width + this.size * 2;
        if (this.x > canvas.width + this.size * 2) this.x = -this.size * 2;
        if (this.y < -this.size * 2) this.y = canvas.height + this.size * 2;
        if (this.y > canvas.height + this.size * 2) this.y = -this.size * 2;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = this.opacity;
        
        foodShapes[this.shapeIndex](ctx, 0, 0, this.size);
        
        ctx.restore();
      }
    }
    
    // Create particles
    const particleCount = Math.min(Math.max(window.innerWidth, window.innerHeight) / 10, 100);
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
      
      mouseTimeout = window.setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Add mouse interaction effect
        if (isMouseMoving) {
          const dx = particle.x - mouseX;
          const dy = particle.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            particle.speedX += dx * force * 0.02;
            particle.speedY += dy * force * 0.02;
          }
        }
        
        particle.update();
        particle.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [color]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

export default AnimatedBackground; 