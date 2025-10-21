import { FileText, Image, Download } from "lucide-react";
import { Button } from "../ui/button";

interface CertificateFilePreviewProps {
  fileUrl: string;
  title: string;
}

const CertificateFilePreview = ({ fileUrl, title }: CertificateFilePreviewProps) => {
  const isImage = /\.(jpe?g|png|gif|webp)$/i.test(fileUrl);
  const isPdf = /\.pdf$/i.test(fileUrl);

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">File Preview:</h4>
      <div className="rounded-lg border p-4 bg-muted/50 flex flex-col items-center justify-center min-h-[200px]">
        {isImage ? (
          <img 
            src={fileUrl} 
            alt={`Preview of ${title}`} 
            className="max-h-64 w-auto object-contain rounded-md shadow-md"
          />
        ) : isPdf ? (
          <div className="text-center">
            <FileText className="h-12 w-12 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">PDF Document</p>
            <p className="text-xs text-muted-foreground mt-1">Click download to view.</p>
          </div>
        ) : (
          <div className="text-center">
            <Image className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Unsupported File Type</p>
          </div>
        )}
      </div>
      <Button asChild variant="outline" className="w-full">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <Download className="h-4 w-4 mr-2" />
          Download / View Full File
        </a>
      </Button>
    </div>
  );
};

export default CertificateFilePreview;