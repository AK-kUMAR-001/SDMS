import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useData } from "../../context/DataContext";

const statusColors: { [key: string]: "default" | "destructive" | "secondary" } = {
    approved: "default",
    rejected: "destructive",
    pending: "secondary",
}

export const RecentSubmissions = () => {
  const { certificates } = useData();
  const recentCertificates = certificates.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>
          The latest certificates submitted for review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentCertificates.map((cert) => (
            <div key={cert.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${cert.studentName}`} alt="Avatar" />
                <AvatarFallback>{cert.studentName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{cert.studentName}</p>
                <p className="text-sm text-muted-foreground truncate">{cert.title}</p>
              </div>
              <div className="ml-auto font-medium">
                <Badge variant={statusColors[cert.status]} className="capitalize">{cert.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};