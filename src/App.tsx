import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ScrollProgressBar from "./components/ScrollProgressBar";
import AnimatedBackground from "./components/AnimatedBackground";

// Lazy load components for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const Scene3D = lazy(() => import("./components/Scene3D"));

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red', padding: 32}}>
        <h2>Something went wrong:</h2>
        <pre>{this.state.error?.toString()}</pre>
      </div>;
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <ScrollProgressBar />
          <AnimatedBackground color="#E07A5F10" />
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipe" element={<RecipePage />} />
                <Route path="/3d-experience" element={<Scene3D />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
