import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Heart, Baby, Plus, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WomensHealth = ({ patient }) => {
  const [menstrualData, setMenstrualData] = useState([]);
  const [pregnancyData, setPregnancyData] = useState([]);
  const [newMenstrualEntry, setNewMenstrualEntry] = useState({
    startDate: '',
    endDate: '',
    flow: 'medium',
    symptoms: '',
    pain: 'mild',
    notes: ''
  });
  const [newPregnancyEntry, setNewPregnancyEntry] = useState({
    date: '',
    week: '',
    weight: '',
    bloodPressure: '',
    symptoms: '',
    notes: '',
    doctorVisit: false,
    concerns: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedMenstrual = localStorage.getItem(`menstrual_data_${patient.healthId}`);
    const savedPregnancy = localStorage.getItem(`pregnancy_data_${patient.healthId}`);
    
    if (savedMenstrual) {
      setMenstrualData(JSON.parse(savedMenstrual));
    }
    if (savedPregnancy) {
      setPregnancyData(JSON.parse(savedPregnancy));
    }
  }, [patient.healthId]);

  const addMenstrualEntry = () => {
    if (!newMenstrualEntry.startDate) {
      toast({
        title: "Missing Information",
        description: "Please provide the start date.",
        variant: "destructive"
      });
      return;
    }

    const entry = {
      ...newMenstrualEntry,
      id: Date.now(),
      dateAdded: new Date().toISOString()
    };

    const updatedData = [entry, ...menstrualData];
    setMenstrualData(updatedData);
    localStorage.setItem(`menstrual_data_${patient.healthId}`, JSON.stringify(updatedData));

    setNewMenstrualEntry({
      startDate: '',
      endDate: '',
      flow: 'medium',
      symptoms: '',
      pain: 'mild',
      notes: ''
    });

    toast({
      title: "Entry Added",
      description: "Menstrual cycle entry has been saved.",
      variant: "default"
    });
  };

  const addPregnancyEntry = () => {
    if (!newPregnancyEntry.date || !newPregnancyEntry.week) {
      toast({
        title: "Missing Information",
        description: "Please provide date and pregnancy week.",
        variant: "destructive"
      });
      return;
    }

    const entry = {
      ...newPregnancyEntry,
      id: Date.now(),
      dateAdded: new Date().toISOString()
    };

    const updatedData = [entry, ...pregnancyData];
    setPregnancyData(updatedData);
    localStorage.setItem(`pregnancy_data_${patient.healthId}`, JSON.stringify(updatedData));

    setNewPregnancyEntry({
      date: '',
      week: '',
      weight: '',
      bloodPressure: '',
      symptoms: '',
      notes: '',
      doctorVisit: false,
      concerns: ''
    });

    toast({
      title: "Entry Added",
      description: "Pregnancy tracking entry has been saved.",
      variant: "default"
    });
  };

  const calculateCycleLength = () => {
    if (menstrualData.length < 2) return null;
    
    const sortedData = [...menstrualData].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const cycles = [];
    
    for (let i = 0; i < sortedData.length - 1; i++) {
      const current = new Date(sortedData[i].startDate);
      const previous = new Date(sortedData[i + 1].startDate);
      const diffTime = Math.abs(current - previous);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      cycles.push(diffDays);
    }
    
    return cycles.length > 0 ? Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length) : null;
  };

  const averageCycleLength = calculateCycleLength();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-soft bg-gradient-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Heart className="w-5 h-5" />
            Women's Health Tracking
          </CardTitle>
          <CardDescription className="text-white/80">
            Track menstrual cycles and pregnancy-related health information
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Menstrual Cycle Tracking */}
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Menstrual Cycle Tracking
          </CardTitle>
          <CardDescription>
            Record your menstrual cycle details and symptoms
            {averageCycleLength && (
              <span className="block mt-1 text-primary font-medium">
                Average cycle length: {averageCycleLength} days
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={newMenstrualEntry.startDate}
                onChange={(e) => setNewMenstrualEntry({ ...newMenstrualEntry, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newMenstrualEntry.endDate}
                onChange={(e) => setNewMenstrualEntry({ ...newMenstrualEntry, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="flow">Flow Intensity</Label>
              <Select onValueChange={(value) => setNewMenstrualEntry({ ...newMenstrualEntry, flow: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select flow intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pain">Pain Level</Label>
              <Select onValueChange={(value) => setNewMenstrualEntry({ ...newMenstrualEntry, pain: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pain level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="symptoms">Symptoms</Label>
            <Textarea
              id="symptoms"
              value={newMenstrualEntry.symptoms}
              onChange={(e) => setNewMenstrualEntry({ ...newMenstrualEntry, symptoms: e.target.value })}
              placeholder="Cramps, headaches, mood changes, etc."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={newMenstrualEntry.notes}
              onChange={(e) => setNewMenstrualEntry({ ...newMenstrualEntry, notes: e.target.value })}
              placeholder="Any additional observations"
              rows={2}
            />
          </div>

          <Button onClick={addMenstrualEntry} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Menstrual Entry
          </Button>
        </CardContent>
      </Card>

      {/* Pregnancy Tracking */}
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-primary" />
            Pregnancy Tracking
          </CardTitle>
          <CardDescription>
            Track pregnancy progress and health indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pregnancyDate">Date *</Label>
              <Input
                id="pregnancyDate"
                type="date"
                value={newPregnancyEntry.date}
                onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="week">Pregnancy Week *</Label>
              <Input
                id="week"
                type="number"
                min="1"
                max="42"
                value={newPregnancyEntry.week}
                onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, week: e.target.value })}
                placeholder="Week number"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={newPregnancyEntry.weight}
                onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, weight: e.target.value })}
                placeholder="Current weight"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                value={newPregnancyEntry.bloodPressure}
                onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, bloodPressure: e.target.value })}
                placeholder="120/80"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="doctorVisit"
                checked={newPregnancyEntry.doctorVisit}
                onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, doctorVisit: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="doctorVisit">Doctor Visit Today</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="pregnancySymptoms">Symptoms</Label>
            <Textarea
              id="pregnancySymptoms"
              value={newPregnancyEntry.symptoms}
              onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, symptoms: e.target.value })}
              placeholder="Morning sickness, fatigue, back pain, etc."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="concerns">Concerns</Label>
            <Textarea
              id="concerns"
              value={newPregnancyEntry.concerns}
              onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, concerns: e.target.value })}
              placeholder="Any concerns or questions for your doctor"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="pregnancyNotes">Notes</Label>
            <Textarea
              id="pregnancyNotes"
              value={newPregnancyEntry.notes}
              onChange={(e) => setNewPregnancyEntry({ ...newPregnancyEntry, notes: e.target.value })}
              placeholder="Additional observations or notes"
              rows={2}
            />
          </div>

          <Button onClick={addPregnancyEntry} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Pregnancy Entry
          </Button>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {(menstrualData.length > 0 || pregnancyData.length > 0) && (
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recent Menstrual Entries */}
            {menstrualData.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Menstrual Cycle</h4>
                <div className="space-y-2">
                  {menstrualData.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="p-3 bg-muted/30 rounded-lg text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p><strong>Date:</strong> {new Date(entry.startDate).toLocaleDateString()}</p>
                          <p><strong>Flow:</strong> <span className="capitalize">{entry.flow}</span> | <strong>Pain:</strong> <span className="capitalize">{entry.pain}</span></p>
                          {entry.symptoms && <p><strong>Symptoms:</strong> {entry.symptoms}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Pregnancy Entries */}
            {pregnancyData.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Pregnancy Tracking</h4>
                <div className="space-y-2">
                  {pregnancyData.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="p-3 bg-muted/30 rounded-lg text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p><strong>Week {entry.week}</strong> - {new Date(entry.date).toLocaleDateString()}</p>
                          {entry.weight && <p><strong>Weight:</strong> {entry.weight} kg</p>}
                          {entry.bloodPressure && <p><strong>BP:</strong> {entry.bloodPressure}</p>}
                          {entry.symptoms && <p><strong>Symptoms:</strong> {entry.symptoms}</p>}
                          {entry.concerns && <p><strong>Concerns:</strong> {entry.concerns}</p>}
                        </div>
                        {entry.doctorVisit && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            Doctor Visit
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WomensHealth;