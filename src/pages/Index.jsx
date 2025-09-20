import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Heart, Shield, Users, Zap, CheckCircle, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Your Health, <span className="bg-gradient-hero bg-clip-text text-transparent">Digitized</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Secure, Aadhaar-based health identity system. Connect patients and doctors with QR-powered health records.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  Get Started
                  <Heart className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Sign In
                  <Shield className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose HealthID?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Modern healthcare needs modern solutions. We provide secure, accessible, and efficient health identity management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-soft">
              <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Aadhaar-based authentication ensures your health data is protected with government-grade security.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-soft">
              <div className="w-16 h-16 bg-gradient-cool rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Access</h3>
              <p className="text-muted-foreground">
                QR code technology enables instant access to health records anywhere, anytime.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-soft">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Everyone</h3>
              <p className="text-muted-foreground">
                Seamlessly connect patients, doctors, and healthcare providers in one unified platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Healthcare Made Simple
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">Instant Registration</h4>
                    <p className="text-muted-foreground">Create your health identity in minutes using your Aadhaar ID</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">QR Code Generation</h4>
                    <p className="text-muted-foreground">Get a unique QR code for quick health record access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">Role-Based Access</h4>
                    <p className="text-muted-foreground">Separate portals for patients and healthcare providers</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-hero rounded-3xl p-8 text-white text-center shadow-glow">
                <Star className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Join Thousands</h3>
                <p className="mb-6">
                  Healthcare professionals and patients already trust HealthID for their digital health needs.
                </p>
                <Link to="/signup">
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">HealthID</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Secure, digital health identity for everyone. Built with modern technology and care.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/signup" className="block text-muted-foreground hover:text-primary transition-smooth">Sign Up</Link>
                <Link to="/login" className="block text-muted-foreground hover:text-primary transition-smooth">Login</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Language | भाषा</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>English</p>
                <p>हिंदी</p>
                <p>తెలుగు</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 HealthID. Secure Digital Health for All.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
