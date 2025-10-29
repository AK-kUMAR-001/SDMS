import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useData } from "../../context/DataContext";
import { showSuccess, showError } from "../../utils/toast";
import { Certificate } from "../../types";
import { Badge } from "../ui/badge";
import CertificateFilePreview from "./CertificateFilePreview";

const formSchema = z.object({
  points: z.coerce.number().min(0, "Points cannot be negative.").optional(),
  reason: z.string().optional(),
});

interface ReviewCertificateDialogProps {
  certificate: Certificate;
  children: React.ReactNode;
}

export const ReviewCertificateDialog = ({ certificate, children }: ReviewCertificateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const { updateCertificateStatus } = useData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (action === 'approve') {
      if (values.points === undefined || values.points < 0) {
        form.setError("points", { type: "manual", message: "Points are required for approval." });
        return;
      }
      updateCertificateStatus(certificate.id, 'approved', { points: values.points });
      showSuccess("Certificate approved.");
    } else if (action === 'reject') {
      if (!values.reason || values.reason.trim().length < 5) {
        form.setError("reason", { type: "manual", message: "A reason (min 5 chars) is required for rejection." });
        return;
      }
      updateCertificateStatus(certificate.id, 'rejected', { reason: values.reason });
      showError("Certificate rejected.");
    }
    setOpen(false);
    form.reset();
    setAction(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Certificate</DialogTitle>
          <DialogDescription>
            Reviewing submission from {certificate.studentName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: File Preview */}
            <div className="md:col-span-1">
                <CertificateFilePreview fileUrl={certificate.fileUrl} title={certificate.title} />
            </div>

            {/* Right Column: Details and Form */}
            <div className="md:col-span-1 space-y-4">
                <div className="space-y-2 text-sm">
                    <p><strong>Certificate:</strong> {certificate.title}</p>
                    <p><strong>Issued By:</strong> {certificate.issuedBy || 'N/A'}</p>
                    <p><strong>Issued Date:</strong> {certificate.issuedDate || 'N/A'}</p>
                    <p><strong>Status:</strong> <Badge variant={certificate.status === 'pending' ? 'secondary' : 'default'} className="capitalize">{certificate.status}</Badge></p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        {action === 'approve' && (
                        <FormField
                            control={form.control}
                            name="points"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Points Awarded</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Enter points" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        )}
                        {action === 'reject' && (
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rejection Reason</FormLabel>
                                <FormControl>
                                <Textarea placeholder="State the reason for rejection" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        )}
                        <DialogFooter className="pt-4">
                        {action ? (
                            <>
                                <Button type="button" variant="ghost" onClick={() => setAction(null)}>Back</Button>
                                <Button type="submit">Confirm</Button>
                            </>
                        ) : (
                            <>
                                <Button type="button" variant="destructive" onClick={() => setAction('reject')}>Reject</Button>
                                <Button type="button" onClick={() => setAction('approve')}>Approve</Button>
                            </>
                        )}
                        </DialogFooter>
                    </form>
                </Form>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};