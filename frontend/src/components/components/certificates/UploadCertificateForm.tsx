import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
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
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { showSuccess } from "../../utils/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CertificateType } from "../../types";
import CertificateFilePreview from "./CertificateFilePreview";
import { Progress } from "../ui/progress";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  type: z.enum(["course", "webinar", "workshop", "internship"]),
  issuedBy: z.string().optional(),
  issuedDate: z.string().optional(),
  file: z.instanceof(FileList).refine((files) => files?.length === 1, "Certificate file is required."),
});

interface UploadCertificateFormProps {
    onUploadSuccess: () => void;
}

export function UploadCertificateForm({ onUploadSuccess }: UploadCertificateFormProps) {
  const { addCertificate } = useData();
  const { user } = useAuth();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "course",
      issuedBy: "",
      issuedDate: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue("file", e.dataTransfer.files);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue("file", e.target.files);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    await new Promise<void>((resolve) => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += 20;
        setProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 120);
    });

    const fileUrl = previewUrl || URL.createObjectURL(values.file[0]);

    await addCertificate({
      title: values.title,
      issuedBy: values.issuedBy,
      issuedDate: values.issuedDate,
      fileUrl: fileUrl,
      studentId: user.id,
      type: values.type as CertificateType,
    });
    showSuccess("Certificate uploaded successfully for review.");
    setUploading(false);
    setProgress(0);
    setSelectedFile(null);
    setPreviewUrl(null);
    form.reset();
    onUploadSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <div
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary bg-muted' : 'border-input bg-background'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload certificate file"
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  {selectedFile ? (
                    <span className="font-medium">{selectedFile.name}</span>
                  ) : (
                    <span className="text-muted-foreground">Drag & drop or click to select a file</span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              {previewUrl && selectedFile && (
                <div className="mt-4">
                  <CertificateFilePreview fileUrl={previewUrl} title={selectedFile.name} />
                </div>
              )}
              {uploading && (
                <div className="mt-4">
                  <Progress value={progress} />
                  <p className="text-xs text-muted-foreground mt-2">Uploading... {progress}%</p>
                </div>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </Button>
      </form>
    </Form>
  );
}