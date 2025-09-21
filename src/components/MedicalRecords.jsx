import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Plus, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const MedicalRecords = ({ patient }) => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    doctorName: '',
    specialization: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    allergies: '',
    notes: '',
    followUpDate: '',
    severity: 'mild'
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedRecords = localStorage.getItem(`medical_records_${patient.healthId}`);
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, [patient.healthId]);

  const saveRecord = () => {
    if (!newRecord.doctorName || !newRecord.diagnosis) {
      toast({
        title: "Missing Information",
        description: "Please fill in doctor name and diagnosis.",
        variant: "destructive"
      });
      return;
    }

    const record = {
      ...newRecord,
      id: Date.now(),
      date: new Date().toISOString(),
      patientId: patient.healthId
    };

    const updatedRecords = [record, ...records];
    setRecords(updatedRecords);
    localStorage.setItem(`medical_records_${patient.healthId}`, JSON.stringify(updatedRecords));

    setNewRecord({
      doctorName: '',
      specialization: '',
      diagnosis: '',
      treatment: '',
      medications: '',
      allergies: '',
      notes: '',
      followUpDate: '',
      severity: 'mild'
    });

    toast({
      title: "Record Added",
      description: "Medical record has been saved successfully.",
      variant: "default"
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Medical Records', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Patient: ${patient.name}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Health ID: ${patient.healthId}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Aadhaar: ****-****-${patient.aadhaar.slice(-4)}`, margin, yPosition);
    yPosition += 20;

    // Records
    records.forEach((record, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(`Record ${index + 1}`, margin, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      const recordInfo = [
        `Date: ${new Date(record.date).toLocaleDateString()} ${new Date(record.date).toLocaleTimeString()}`,
        `Doctor: ${record.doctorName}`,
        `Specialization: ${record.specialization}`,
        `Diagnosis: ${record.diagnosis}`,
        `Treatment: ${record.treatment}`,
        `Medications: ${record.medications}`,
        `Allergies: ${record.allergies}`,
        `Severity: ${record.severity}`,
        `Notes: ${record.notes}`,
        `Follow-up: ${record.followUpDate || 'Not scheduled'}`
      ];

      recordInfo.forEach((info) => {
        if (info.split(': ')[1]) {
          doc.text(info, margin, yPosition);
          yPosition += 8;
        }
      });

      yPosition += 10;
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
    });

    doc.save(`${patient.name}_Medical_Records_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Downloaded",
      description: "Medical records have been downloaded successfully.",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Add New Record */}
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add Medical Record
          </CardTitle>
          <CardDescription>
            Record new medical consultation and treatment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctorName">Doctor Name *</Label>
              <Input
                id="doctorName"
                value={newRecord.doctorName}
                onChange={(e) => setNewRecord({ ...newRecord, doctorName: e.target.value })}
                placeholder="Dr. John Smith"
              />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={newRecord.specialization}
                onChange={(e) => setNewRecord({ ...newRecord, specialization: e.target.value })}
                placeholder="Cardiology, Neurology, etc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              value={newRecord.diagnosis}
              onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
              placeholder="Primary diagnosis and findings"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="treatment">Treatment</Label>
            <Textarea
              id="treatment"
              value={newRecord.treatment}
              onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
              placeholder="Treatment plan and procedures"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="medications">Medications</Label>
              <Textarea
                id="medications"
                value={newRecord.medications}
                onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                placeholder="Prescribed medications and dosage"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={newRecord.allergies}
                onChange={(e) => setNewRecord({ ...newRecord, allergies: e.target.value })}
                placeholder="Known allergies and reactions"
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select onValueChange={(value) => setNewRecord({ ...newRecord, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={newRecord.followUpDate}
                onChange={(e) => setNewRecord({ ...newRecord, followUpDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              placeholder="Additional observations and notes"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={saveRecord} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
            {records.length > 0 && (
              <Button variant="outline" onClick={generatePDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Records History */}
      {records.length > 0 && (
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Medical History ({records.length} records)
            </CardTitle>
            <CardDescription>
              Complete medical records history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {records.map((record, index) => (
                <div key={record.id} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {new Date(record.date).toLocaleDateString()} - {new Date(record.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Dr. {record.doctorName}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                      {record.treatment && <p><strong>Treatment:</strong> {record.treatment}</p>}
                      {record.medications && <p><strong>Medications:</strong> {record.medications}</p>}
                    </div>
                    <div>
                      {record.allergies && <p><strong>Allergies:</strong> {record.allergies}</p>}
                      <p><strong>Severity:</strong> <span className={`capitalize px-2 py-1 rounded-full text-xs ${record.severity === 'critical' ? 'bg-red-100 text-red-800' : record.severity === 'severe' ? 'bg-orange-100 text-orange-800' : record.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{record.severity}</span></p>
                      {record.followUpDate && <p><strong>Follow-up:</strong> {new Date(record.followUpDate).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  
                  {record.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p><strong>Notes:</strong> {record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalRecords;