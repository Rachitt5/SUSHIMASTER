import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import TrendingCarousel from "@/components/TrendingCarousel";
import ParallaxGallery from "@/components/ParallaxGallery";
import FoodCustomizer from "@/components/FoodCustomizer";
import Card3D from "@/components/Card3D";
import { ChevronRight, Menu, X, Instagram, Twitter, Facebook } from "lucide-react";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Examples of featured recipes with data
  const featuredRecipes = [
    {
      id: 1,
      title: "Mushroom Risotto",
      description: "Creamy Arborio rice slowly cooked with exotic mushrooms and finished with truffle oil and parmesan.",
      image: "/lovable-uploads/f977882f-7c7f-4937-a0fb-dda5670df3af.png",
      difficulty: "Intermediate",
      prepTime: "35 mins"
    },
    {
      id: 2,
      title: "Avocado Toast",
      description: "Artisanal sourdough topped with mashed avocado, micro greens, and poached egg with a sprinkle of red pepper flakes.",
      image: "/lovable-uploads/3c74466f-d8a5-4966-b3a5-ccd702527151.png",
      difficulty: "Easy",
      prepTime: "15 mins"
    },
    {
      id: 3,
      title: "Berry Parfait",
      description: "Layers of Greek yogurt, honey, granola, and seasonal berries in a visually stunning breakfast creation.",
      image: "/lovable-uploads/aeca7ad2-25c9-4fb5-9cb6-b717c8890730.png",
      difficulty: "Easy",
      prepTime: "10 mins"
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
  
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-navy/90 to-navy/0 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <Link to="/" className="text-white text-2xl font-playfair font-bold">
              Culinary Canvas
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-terracotta transition-colors">Home</Link>
              <Link to="/recipe" className="text-white hover:text-terracotta transition-colors">Recipes</Link>
              <Link to="/3d-experience" className="text-white hover:text-terracotta transition-colors">3D Experience</Link>
              <Link to="#" className="text-white hover:text-terracotta transition-colors">About</Link>
              <Link to="#" className="text-white hover:text-terracotta transition-colors">Contact</Link>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile menu overlay */}
      <motion.div 
        className={`fixed inset-0 bg-navy z-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: mobileMenuOpen ? 0 : '100%', opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-white text-2xl font-playfair font-bold">Menu</span>
            <button 
              className="text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-6">
            <Link to="/" className="text-white text-2xl hover:text-terracotta transition-colors">Home</Link>
            <Link to="/recipe" className="text-white text-2xl hover:text-terracotta transition-colors">Recipes</Link>
            <Link to="/3d-experience" className="text-white text-2xl hover:text-terracotta transition-colors">3D Experience</Link>
            <Link to="#" className="text-white text-2xl hover:text-terracotta transition-colors">About</Link>
            <Link to="#" className="text-white text-2xl hover:text-terracotta transition-colors">Contact</Link>
          </nav>
          
          <div className="absolute bottom-10 left-0 right-0 px-4">
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-white hover:text-terracotta transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-terracotta transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-white hover:text-terracotta transition-colors">
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trending Carousel */}
      <TrendingCarousel />
      
      {/* Featured Recipes */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-playfair font-bold mb-4 text-navy"
            >
              Featured Creations
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Explore our chef's favorite culinary artworks with stunning visual presentations
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: recipe.id * 0.1 }}
              >
                <Card3D
                  title={recipe.title}
                  description={recipe.description}
                  image={recipe.image}
                  difficulty={recipe.difficulty}
                  prepTime={recipe.prepTime}
                  onClick={() => {}}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/recipe" className="inline-flex items-center bg-navy text-white px-6 py-3 rounded-full hover:bg-navy/90 transition-colors">
              Explore All Recipes
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-72 bg-[radial-gradient(ellipse_at_top,rgba(129,178,154,0.15),transparent_70%)]"></div>
      </section>
      
      {/* Interactive Food Customizer */}
      <section className="py-20 bg-cream relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4 text-navy">Create Your Own</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unleash your creativity with our interactive food customizer
            </p>
          </motion.div>
          
          <FoodCustomizer />
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(224,122,95,0.1),transparent_50%)]"></div>
      </section>
      
      {/* Gallery with Parallax Effect */}
      <ParallaxGallery />
      
      {/* 3D Experience CTA */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('public/lovable-uploads/f19b950a-5a87-4648-be41-94416d57778e.png')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-playfair font-bold mb-6"
            >
              Experience Food in <span className="text-terracotta">3D</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/80 mb-10"
            >
              Dive into an immersive 3D world where you can explore culinary creations from every angle. Interact with ingredients, see cooking techniques in action, and gain a new perspective on food.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/3d-experience"
                className="inline-block bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors"
              >
                Enter 3D Experience
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-navy-dark py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-playfair font-bold mb-6">Culinary Canvas</h3>
              <p className="text-white/70 mb-6">
                Where art meets cuisine in a visual symphony of taste and aesthetics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-terracotta transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-white hover:text-terracotta transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-white hover:text-terracotta transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/recipe" className="text-white/70 hover:text-white transition-colors">Recipes</Link></li>
                <li><Link to="/3d-experience" className="text-white/70 hover:text-white transition-colors">3D Experience</Link></li>
                <li><Link to="#" className="text-white/70 hover:text-white transition-colors">About</Link></li>
                <li><Link to="#" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Recipe Categories</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Appetizers</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Main Courses</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Desserts</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Beverages</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Special Diets</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Subscribe</h4>
              <p className="text-white/70 mb-4">
                Get the latest recipes and updates delivered to your inbox.
              </p>
              <form className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-terracotta"
                />
                <button 
                  type="submit"
                  className="w-full bg-terracotta hover:bg-terracotta/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
            <p>© {new Date().getFullYear()} Culinary Canvas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 