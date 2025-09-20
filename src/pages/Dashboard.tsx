import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import QRGenerator from '@/components/QRGenerator';
import { User, Heart, LogOut, Calendar, Phone, Building2, Award } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Welcome, {user.name}!</h1>
              <p className="text-muted-foreground">Manage your health profile</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your registered health details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-base capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health ID</p>
                  <p className="text-base font-mono">{user.healthId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aadhaar</p>
                  <p className="text-base font-mono">****-****-{user.aadhaar.slice(-4)}</p>
                </div>
              </div>

              {user.role === 'patient' ? (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {user.dob && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Date of Birth
                      </p>
                      <p className="text-base">{new Date(user.dob).toLocaleDateString()}</p>
                    </div>
                  )}
                  {user.gender && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="text-base capitalize">{user.gender}</p>
                    </div>
                  )}
                  {user.phone && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Phone
                      </p>
                      <p className="text-base">{user.phone}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t">
                  {user.specialization && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Specialization
                      </p>
                      <p className="text-base">{user.specialization}</p>
                    </div>
                  )}
                  {user.hospital && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        Hospital/Clinic
                      </p>
                      <p className="text-base">{user.hospital}</p>
                    </div>
                  )}
                  {user.medicalRegNo && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Medical Reg. No.</p>
                      <p className="text-base font-mono">{user.medicalRegNo}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t text-xs text-muted-foreground">
                Account created: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <div>
            <QRGenerator 
              aadhaar={user.aadhaar}
              healthId={user.healthId}
              role={user.role}
              name={user.name}
            />
          </div>
        </div>

        {/* Health Stats or Features */}
        <div className="mt-8">
          <Card className="border-0 shadow-soft bg-gradient-hero">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="w-5 h-5" />
                Health Features
              </CardTitle>
              <CardDescription className="text-white/80">
                Coming soon - manage your health records and appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Medical Records
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Appointments
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Health Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;