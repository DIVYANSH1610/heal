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
    const pageHeight = doc.internal.pageSize.height;
    const margin = 25;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = 40;

    // Professional Header
    doc.setFillColor(41, 128, 185); // Medical blue
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('MEDICAL RECORDS', pageWidth / 2, 22, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 55;

    // Patient Information Section
    doc.setFillColor(248, 249, 250); // Light gray background
    doc.rect(margin, yPosition - 5, contentWidth, 45, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPosition - 5, contentWidth, 45);
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('PATIENT INFORMATION', margin + 10, yPosition + 8);
    
    yPosition += 20;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Two column layout for patient info
    const leftCol = margin + 10;
    const rightCol = margin + (contentWidth / 2) + 10;
    
    doc.text(`Patient Name: ${patient.name}`, leftCol, yPosition);
    doc.text(`Health ID: ${patient.healthId}`, rightCol, yPosition);
    yPosition += 12;
    doc.text(`Aadhaar: ****-****-${patient.aadhaar.slice(-4)}`, leftCol, yPosition);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, rightCol, yPosition);
    
    yPosition += 25;

    // Records Section Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`MEDICAL RECORDS (${records.length} Total)`, margin, yPosition);
    yPosition += 15;

    // Records (newest first - already in correct order)
    records.forEach((record, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        doc.addPage();
        yPosition = 40;
      }

      // Record Header with background
      const recordHeight = 25;
      doc.setFillColor(index % 2 === 0 ? 245 : 250, index % 2 === 0 ? 245 : 250, index % 2 === 0 ? 245 : 250);
      doc.rect(margin, yPosition - 5, contentWidth, recordHeight, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, yPosition - 5, contentWidth, recordHeight);

      // Record number and date
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text(`RECORD #${String(index + 1).padStart(3, '0')}`, margin + 10, yPosition + 5);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const dateStr = `${new Date(record.date).toLocaleDateString()} at ${new Date(record.date).toLocaleTimeString()}`;
      doc.text(dateStr, pageWidth - margin - 10 - (dateStr.length * 2), yPosition + 5);

      yPosition += 18;

      // Doctor and Specialization
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('ATTENDING PHYSICIAN', margin + 10, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(`Dr. ${record.doctorName}`, margin + 60, yPosition);
      if (record.specialization) {
        doc.text(`(${record.specialization})`, margin + 60 + (record.doctorName.length * 2.5), yPosition);
      }

      yPosition += 15;

      // Two-column content layout
      const col1Width = contentWidth * 0.48;
      const col2Width = contentWidth * 0.48;
      const col1X = margin + 10;
      const col2X = margin + 10 + col1Width + 15;
      let col1Y = yPosition;
      let col2Y = yPosition;

      // Left Column - Primary Information
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('DIAGNOSIS', col1X, col1Y);
      col1Y += 8;
      doc.setFont(undefined, 'normal');
      const diagnosisLines = doc.splitTextToSize(record.diagnosis, col1Width);
      doc.text(diagnosisLines, col1X, col1Y);
      col1Y += diagnosisLines.length * 5 + 8;

      if (record.treatment) {
        doc.setFont(undefined, 'bold');
        doc.text('TREATMENT', col1X, col1Y);
        col1Y += 8;
        doc.setFont(undefined, 'normal');
        const treatmentLines = doc.splitTextToSize(record.treatment, col1Width);
        doc.text(treatmentLines, col1X, col1Y);
        col1Y += treatmentLines.length * 5 + 8;
      }

      if (record.medications) {
        doc.setFont(undefined, 'bold');
        doc.text('MEDICATIONS', col1X, col1Y);
        col1Y += 8;
        doc.setFont(undefined, 'normal');
        const medicationLines = doc.splitTextToSize(record.medications, col1Width);
        doc.text(medicationLines, col1X, col1Y);
        col1Y += medicationLines.length * 5;
      }

      // Right Column - Additional Information
      if (record.allergies) {
        doc.setFont(undefined, 'bold');
        doc.text('ALLERGIES', col2X, col2Y);
        col2Y += 8;
        doc.setFont(undefined, 'normal');
        const allergyLines = doc.splitTextToSize(record.allergies, col2Width);
        doc.text(allergyLines, col2X, col2Y);
        col2Y += allergyLines.length * 5 + 8;
      }

      // Severity with visual indicator
      doc.setFont(undefined, 'bold');
      doc.text('SEVERITY LEVEL', col2X, col2Y);
      col2Y += 8;
      
      // Color code severity
      let severityColor = [76, 175, 80]; // Green for mild
      if (record.severity === 'moderate') severityColor = [255, 193, 7]; // Yellow
      if (record.severity === 'severe') severityColor = [255, 152, 0]; // Orange  
      if (record.severity === 'critical') severityColor = [244, 67, 54]; // Red
      
      doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
      doc.rect(col2X, col2Y - 3, 8, 8, 'F');
      doc.setFont(undefined, 'normal');
      doc.text(record.severity.toUpperCase(), col2X + 12, col2Y + 2);
      col2Y += 15;

      if (record.followUpDate) {
        doc.setFont(undefined, 'bold');
        doc.text('FOLLOW-UP SCHEDULED', col2X, col2Y);
        col2Y += 8;
        doc.setFont(undefined, 'normal');
        doc.text(new Date(record.followUpDate).toLocaleDateString(), col2X, col2Y);
        col2Y += 12;
      }

      // Notes section (full width)
      const maxY = Math.max(col1Y, col2Y);
      yPosition = maxY + 5;

      if (record.notes) {
        doc.setFont(undefined, 'bold');
        doc.text('CLINICAL NOTES', margin + 10, yPosition);
        yPosition += 8;
        doc.setFont(undefined, 'normal');
        const notesLines = doc.splitTextToSize(record.notes, contentWidth - 20);
        doc.text(notesLines, margin + 10, yPosition);
        yPosition += notesLines.length * 5;
      }

      // Record separator
      yPosition += 15;
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(1);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 20;
    });

    // Footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
      doc.text(`Confidential Medical Document - ${patient.name}`, margin, pageHeight - 10);
    }

    doc.save(`${patient.name}_Medical_Records_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Downloaded",
      description: "Professional medical records have been downloaded successfully.",
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