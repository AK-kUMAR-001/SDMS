import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { UploadCertificateForm } from "./UploadCertificateForm";
import { useState } from "react";

interface UploadCertificateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UploadCertificateDialog = ({ open, onOpenChange }: UploadCertificateDialogProps) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleUploadSuccess = () => {
        setIsFormSubmitted(true);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Certificate</DialogTitle>
                    <DialogDescription>
                        Fill in the details and upload your certificate file for review.
                    </DialogDescription>
                </DialogHeader>
                <UploadCertificateForm onUploadSuccess={handleUploadSuccess} />
            </DialogContent>
        </Dialog>
    );
};