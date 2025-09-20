import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, QrCode } from 'lucide-react';

const QRGenerator = ({ aadhaar, healthId, role, name }) => {
  const qrRef = useRef(null);

  const qrData = JSON.stringify({
    aadhaar,
    healthId,
    role,
    name,
    generatedAt: new Date().toISOString()
  });

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 240;
      canvas.height = 240;
      
      img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.download = `HealthID_${healthId}_QR.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-card border-0 shadow-glow">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-primary">
          <QrCode className="w-5 h-5" />
          Your Health QR Code
        </CardTitle>
        <CardDescription>
          Scan this code to access your health profile
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center bg-white p-4 rounded-2xl" ref={qrRef}>
          <QRCodeSVG
            value={qrData}
            size={200}
            level="H"
            includeMargin={true}
            fgColor="#222"
            bgColor="#fff"
          />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>Name:</strong> {name}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Health ID:</strong> {healthId}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Role:</strong> {role}
          </p>
        </div>
        
        <Button 
          onClick={downloadQR} 
          variant="success" 
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;