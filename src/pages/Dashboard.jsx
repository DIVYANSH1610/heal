import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import QRGenerator from '@/components/QRGenerator';
import MedicalRecords from '@/components/MedicalRecords';
import ExerciseSection from '@/components/ExerciseSection';
import WomensHealth from '@/components/WomensHealth';
import { User, Heart, LogOut, Calendar, Phone, Building2, Award, FileText, Zap, Baby } from 'lucide-react';

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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Records
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Exercises
            </TabsTrigger>
            {user.gender === 'female' && (
              <TabsTrigger value="womens-health" className="flex items-center gap-2">
                <Baby className="w-4 h-4" />
                Women's Health
              </TabsTrigger>
            )}
            <TabsTrigger value="qr-code" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
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

              {/* Health Stats */}
              <Card className="border-0 shadow-soft bg-gradient-hero">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Heart className="w-5 h-5" />
                    Health Overview
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Your health management dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/20 p-4 rounded-lg">
                      <h4 className="text-white font-medium">Quick Stats</h4>
                      <p className="text-white/80 text-sm mt-1">
                        All your health data in one place
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 p-3 rounded-lg text-center">
                        <p className="text-white/60 text-xs">Medical Records</p>
                        <p className="text-white text-lg font-bold">
                          {JSON.parse(localStorage.getItem(`medical_records_${user.healthId}`) || '[]').length}
                        </p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg text-center">
                        <p className="text-white/60 text-xs">Health Score</p>
                        <p className="text-white text-lg font-bold">Good</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records" className="mt-6">
            <MedicalRecords patient={user} />
          </TabsContent>

          <TabsContent value="exercises" className="mt-6">
            <ExerciseSection />
          </TabsContent>

          {user.gender === 'female' && (
            <TabsContent value="womens-health" className="mt-6">
              <WomensHealth patient={user} />
            </TabsContent>
          )}

          <TabsContent value="qr-code" className="mt-6">
            <QRGenerator 
              aadhaar={user.aadhaar}
              healthId={user.healthId}
              role={user.role}
              name={user.name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;