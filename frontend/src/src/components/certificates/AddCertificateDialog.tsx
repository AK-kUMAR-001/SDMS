import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";
import { CertificateType } from "../../types";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  type: z.enum(["course", "webinar", "workshop", "internship", "project", "other"]),
  issuedBy: z.string().optional(),
  issuedDate: z.string().optional(),
  file: z.instanceof(FileList).refine((files) => files?.length === 1, "Certificate file is required."),
});

interface AddCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCertificateDialog = ({ open, onOpenChange }: AddCertificateDialogProps) => {
  const { addCertificate } = useData();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "course",
      issuedBy: "",
      issuedDate: "",
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsSubmitting(true);

    // 1. Mock file upload: In a real app, this would be an API call to upload the file
    // and get a permanent URL (e.g., Supabase Storage, S3).
    const file = values.file[0];
    const fileUrl = URL.createObjectURL(file);

    const newCertificate = {
      title: values.title,
      type: values.type as CertificateType,
      issuedBy: values.issuedBy,
      issuedDate: values.issuedDate,
      fileUrl: fileUrl, // FIX: Pass fileUrl instead of file
      studentId: user.id,
    };

    await addCertificate(newCertificate);
    setIsSubmitting(false);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Certificate</DialogTitle>
          <DialogDescription>
            Submit a certificate for review and point allocation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., National Programming Contest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="course">Online Course</SelectItem>
                      <SelectItem value="webinar">Webinar/Seminar</SelectItem>
                      <SelectItem value="project">Major Project</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issued By (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., National Coding Association" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issued Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Certificate File (PDF, JPG, PNG)</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Submit Certificate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};