export type Permission = {
  id: string;
  action: string;
  subject: string;
  description: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
};

export const permissions: Permission[] = [
  { id: 'p01', action: 'manage', subject: 'all', description: 'Full administrative access to the entire system.' },
  { id: 'p02', action: 'manage', subject: 'users', description: 'Create, edit, and delete any user account.' },
  { id: 'p03', action: 'read', subject: 'users', description: 'View lists and profiles of users.' },
  { id: 'p04', action: 'manage', subject: 'certificates', description: 'Approve or reject any submitted certificate.' },
  { id: 'p05', action: 'review', subject: 'certificates', description: 'Review certificates for a specific department.' },
  { id: 'p06', action: 'read', subject: 'certificates', description: 'View all submitted certificates across the system.' },
  { id: 'p07', action: 'upload', subject: 'certificate', description: 'Upload a personal certificate for review.' },
  { id: 'p08', action: 'read', subject: 'leaderboard', description: 'View the student leaderboard.' },
  { id: 'p09', action: 'read', subject: 'dashboard', description: 'View the main dashboard.' },
];

export const roles: Role[] = [
  {
    id: 'r01',
    name: 'Admin',
    description: 'Has all permissions to manage the system.',
    permissions: ['p01'],
  },
  {
    id: 'r02',
    name: 'Dean',
    description: 'Oversees multiple departments and can manage users and certificates.',
    permissions: ['p02', 'p04', 'p06', 'p08', 'p09'],
  },
  {
    id: 'r03',
    name: 'HOD',
    description: 'Head of Department, manages faculty and reviews student certificates.',
    permissions: ['p03', 'p05', 'p06', 'p08', 'p09'],
  },
  {
    id: 'r04',
    name: 'Faculty',
    description: 'Can view students in their department and review certificates.',
    permissions: ['p03', 'p05', 'p08', 'p09'],
  },
  {
    id: 'r05',
    name: 'Student',
    description: 'Can upload certificates and view their status and the leaderboard.',
    permissions: ['p06', 'p07', 'p08', 'p09'],
  },
];