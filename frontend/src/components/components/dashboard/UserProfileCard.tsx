import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Phone, Calendar, Home } from 'lucide-react';

const UserProfileCard = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    profilePicture: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
  } | null>(null);

  useEffect(() => {
    // Fetch user data from backend
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setUser({
          name: data.name,
          email: data.email,
          profilePicture: data.profilePicture || '/default-avatar.png',
          phoneNumber: data.phoneNumber || 'N/A',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'N/A',
          address: data.address || 'N/A'
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="p-4 text-gray-500">Loading profile...</div>;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center gap-4">
        <Avatar src={user.profilePicture} alt="Profile" className="w-24 h-24" />
        <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
        <p className="text-gray-600">{user.email}</p>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <p>Phone: {user.phoneNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <p>DOB: {user.dateOfBirth}</p>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <p>Address: {user.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;