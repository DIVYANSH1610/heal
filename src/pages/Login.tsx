import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { LogIn, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aadhaar: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const validateAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!validateAadhaar(formData.aadhaar)) {
      toast({
        title: "Invalid Aadhaar",
        description: "Aadhaar ID must be exactly 12 digits",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!formData.password) {
      toast({
        title: "Missing Password",
        description: "Please enter your password",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Mock authentication
    const existingUsers = JSON.parse(localStorage.getItem('healthUsers') || '[]');
    const user = existingUsers.find(u => 
      u.aadhaar === formData.aadhaar && u.password === formData.password
    );

    setTimeout(() => {
      if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        console.log('Login successful:', user);
        
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${user.name}!`,
        });

        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid Aadhaar ID or password",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-glow bg-gradient-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <LogIn className="w-6 h-6 text-primary" />
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to your health account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="aadhaar">Aadhaar ID</Label>
                  <Input
                    id="aadhaar"
                    placeholder="Enter 12-digit Aadhaar ID"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                    maxLength={12}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Shield className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button variant="link" onClick={() => navigate('/signup')} className="p-0 h-auto">
                    Create one here
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;