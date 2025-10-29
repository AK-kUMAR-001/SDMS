import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const UpdateProfileForm = () => {
  const { user } = useAuth();
  const { updateUser } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedData = { ...formData };
      if (profilePictureFile) {
        // Handle file upload separately if needed, or pass it to updateUser
        // For now, we'll just update the profilePicture field with a placeholder or actual URL after upload
        // This part will need actual implementation for file upload to backend
        console.log("Profile picture file to upload:", profilePictureFile);
      }
      await updateUser(user.id, updatedData);
      toast.success("Profile updated successfully!");
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={formData.department} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <Input id="profilePicture" type="file" onChange={handleFileChange} />
            {user.profilePicture && (
              <img src={user.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover mt-2" />
            )}
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
};