import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:scale-105 transition-bounce">
          <Heart className="w-6 h-6 text-primary" />
          HEAL
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button 
              variant={isActive('/') ? 'default' : 'ghost'} 
              size="sm"
            >
              Home
            </Button>
          </Link>
          
          <Link to="/signup">
            <Button 
              variant={isActive('/signup') ? 'warm' : 'ghost'} 
              size="sm"
            >
              Signup
            </Button>
          </Link>
          
          <Link to="/login">
            <Button 
              variant={isActive('/login') ? 'cool' : 'ghost'} 
              size="sm"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;