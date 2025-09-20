import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Link to="/">
          <Button variant="hero" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
