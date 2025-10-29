import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Certificate } from "../../types"; // Updated import
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";

const statusIcons = {
  approved: <CheckCircle className="h-4 w-4 text-green-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
};

const statusColors: { [key: string]: "default" | "destructive" | "secondary" } = {
    approved: "default",
    rejected: "destructive",
    pending: "secondary",
}

const CertificateCard = ({ certificate }: { certificate: Certificate }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-lg">{certificate.title}</CardTitle>
                <CardDescription>Submitted on {certificate.submittedAt}</CardDescription>
            </div>
            <Badge variant={statusColors[certificate.status]} className="flex items-center gap-1">
                {statusIcons[certificate.status]}
                {certificate.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-2 h-4 w-4" />
            <span>{certificate.fileUrl}</span>
        </div>
        {certificate.status === 'approved' && (
            <p className="text-sm font-semibold text-green-600 mt-2">Points Awarded: {certificate.points}</p>
        )}
        {certificate.status === 'rejected' && certificate.rejectionReason && (
            <p className="text-sm text-red-600 mt-2">Reason: {certificate.rejectionReason}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;