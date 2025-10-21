import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useData } from "../../context/DataContext";
import { showError } from "../../utils/toast";
import { User } from "../../types"; // Updated import

interface DeactivateUserDialogProps {
  user: User;
  children: React.ReactNode;
}

export const DeactivateUserDialog = ({ user, children }: DeactivateUserDialogProps) => {
  const { deactivateUser } = useData();

  const handleDeactivate = () => {
    deactivateUser(user.id);
    showError(`User ${user.name} has been deactivated.`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the user '{user.name}' as inactive. They may lose access to certain features. This action can be reversed later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};