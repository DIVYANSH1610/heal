import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import QRGenerator from '@/components/QRGenerator';
import { UserPlus, Stethoscope, User } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [showQR, setShowQR] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    aadhaar: '',
    password: '',
    name: '',
    // Patient fields
    dob: '',
    gender: '',
    phone: '',
    // Doctor fields
    specialization: '',
    hospital: '',
    medicalRegNo: ''
  });

  const validateAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const generateHealthId = () => {
    return 'HLTH' + Date.now() + Math.random().toString(36).substr(2, 5);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateAadhaar(formData.aadhaar)) {
      toast({
        title: "Invalid Aadhaar",
        description: "Aadhaar ID must be exactly 12 digits",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate Health ID
    const healthId = generateHealthId();
    
    // Create user object
    const user = {
      aadhaar: formData.aadhaar,
      password: formData.password,
      name: formData.name,
      role,
      healthId,
      ...(role === 'patient' ? {
        dob: formData.dob,
        gender: formData.gender,
        phone: formData.phone
      } : {
        specialization: formData.specialization,
        hospital: formData.hospital,
        medicalRegNo: formData.medicalRegNo
      }),
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('healthUsers') || '[]');
    
    // Check if Aadhaar already exists
    if (existingUsers.find(u => u.aadhaar === formData.aadhaar)) {
      toast({
        title: "User Already Exists",
        description: "This Aadhaar ID is already registered",
        variant: "destructive"
      });
      return;
    }

    existingUsers.push(user);
    localStorage.setItem('healthUsers', JSON.stringify(existingUsers));

    console.log('User registered:', user);
    
    setUserData(user);
    setShowQR(true);
    
    toast({
      title: "Registration Successful!",
      description: `Welcome ${user.name}! Your Health ID: ${healthId}`,
    });
  };

  if (showQR && userData) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Registration Complete!</h1>
            <p className="text-white/80 text-lg">Your Health ID has been generated successfully</p>
          </div>
          
          <QRGenerator 
            aadhaar={userData.aadhaar}
            healthId={userData.healthId}
            role={userData.role}
            name={userData.name}
          />
          
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-glow bg-gradient-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                Create Health Account
              </CardTitle>
              <CardDescription>
                Join the digital health ecosystem
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Role Toggle */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">I am a:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={role === 'patient' ? 'warm' : 'outline'}
                    onClick={() => setRole('patient')}
                    className="justify-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Patient
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'doctor' ? 'cool' : 'outline'}
                    onClick={() => setRole('doctor')}
                    className="justify-center"
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Doctor
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Fields */}
                <div>
                  <Label htmlFor="aadhaar">Aadhaar ID *</Label>
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
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                {/* Role-specific Fields */}
                {role === 'patient' ? (
                  <>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="e.g., Cardiology, General Medicine"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hospital">Hospital/Clinic</Label>
                      <Input
                        id="hospital"
                        placeholder="Hospital or clinic name"
                        value={formData.hospital}
                        onChange={(e) => handleInputChange('hospital', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicalRegNo">Medical Registration Number</Label>
                      <Input
                        id="medicalRegNo"
                        placeholder="Medical registration number"
                        value={formData.medicalRegNo}
                        onChange={(e) => handleInputChange('medicalRegNo', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <Button type="submit" variant="hero" className="w-full">
                  Create Health Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;