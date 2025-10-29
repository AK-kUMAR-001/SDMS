import instance from './axios';

const API_BASE_URL = 'http://localhost:3005/api/v1';
const USE_MOCK_DATA = true; // Set to false when backend is ready

// Mock data for development
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    registrationNumber: 'STU001',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'faculty',
    registrationNumber: 'FAC001',
    createdAt: new Date().toISOString()
  }
];

const mockCertificates = [
  {
    id: '1',
    title: 'Web Development Certification',
    userId: '1',
    userName: 'John Doe',
    issuedDate: new Date().toISOString(),
    verificationCode: 'CERT001',
    status: 'verified'
  },
  {
    id: '2',
    title: 'Data Science Certification',
    userId: '2',
    userName: 'Jane Smith',
    issuedDate: new Date().toISOString(),
    verificationCode: 'CERT002',
    status: 'verified'
  }
];

class LocalDB {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Enhanced get method with mock data fallback
  private async get(endpoint: string): Promise<any> {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for ${endpoint}`);
      return this.getMockData(endpoint);
    }

    try {
      const response = await instance.get(`${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      console.log('Falling back to mock data...');
      return this.getMockData(endpoint);
    }
  }

  // Mock data provider
  private getMockData(endpoint: string): any {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('/users')) {
          resolve({ data: mockUsers, success: true });
        } else if (endpoint.includes('/certificates')) {
          resolve({ data: mockCertificates, success: true });
        } else {
          resolve({ data: [], success: true });
        }
      }, 300); // 300ms delay to simulate network
    });
  }

  // Enhanced post method with mock data fallback
   private async post(endpoint: string, data: any): Promise<any> {
     if (USE_MOCK_DATA) {
       console.log(`Mock POST to ${endpoint}:`, data);
       return { success: true, data: { id: Date.now().toString(), ...data } };
     }

     try {
       const response = await instance.post(`${endpoint}`, data);
       return response.data;
     } catch (error) {
       console.error(`Error posting to ${endpoint}:`, error);
       return { success: false, error: 'Failed to connect to server' };
     }
   }

   // Enhanced put method
   private async put(endpoint: string, data: any): Promise<any> {
     if (USE_MOCK_DATA) {
       console.log(`Mock PUT to ${endpoint}:`, data);
       return { success: true, data };
     }

     try {
       const response = await instance.put(`${endpoint}`, data);
       return response.data;
     } catch (error) {
       console.error(`Error updating ${endpoint}:`, error);
       return { success: false, error: 'Failed to connect to server' };
     }
   }

   // Enhanced delete method
   private async delete(endpoint: string): Promise<any> {
     if (USE_MOCK_DATA) {
       console.log(`Mock DELETE to ${endpoint}`);
       return { success: true };
     }

     try {
       const response = await instance.delete(`${endpoint}`);
       return response.data;
     } catch (error) {
       console.error(`Error deleting from ${endpoint}:`, error);
       return { success: false, error: 'Failed to connect to server' };
     }
   }

   // Users
   async getUsers() {
     const response = await this.get('/users');
     return response.data || [];
   }

   async getUserById(id: string) {
     const response = await this.get(`/users/${id}`);
     return response.data;
   }

   async createUser(userData: any) {
     return await this.post('/users', userData);
   }

   async updateUser(id: string, userData: any) {
     return await this.put(`/users/${id}`, userData);
   }

   async deleteUser(id: string) {
     return await this.delete(`/users/${id}`);
   }

   // Certificates
   async getCertificates() {
     const response = await this.get('/certificates');
     return response.data || [];
   }

   async getCertificateById(id: string) {
     const response = await this.get(`/certificates/${id}`);
     return response.data;
   }

   async createCertificate(certData: any) {
     return await this.post('/certificates', certData);
   }

   async updateCertificate(id: string, certData: any) {
     return await this.put(`/certificates/${id}`, certData);
   }

   async deleteCertificate(id: string) {
     return await this.delete(`/certificates/${id}`);
   }

   async verifyCertificate(verificationCode: string) {
     const response = await this.get(`/certificates/verify/${verificationCode}`);
     return response.data;
   }

   // Stats/Dashboard
   async getStats() {
     if (USE_MOCK_DATA) {
       return {
         totalUsers: mockUsers.length,
         totalCertificates: mockCertificates.length,
         verifiedCertificates: mockCertificates.filter(c => c.status === 'verified').length,
         pendingCertificates: mockCertificates.filter(c => c.status === 'pending').length,
       };
     }
     const response = await this.get('/stats');
     return response.data;
   }

   getBaseUrl() {
    return this.baseURL;
  }

   async deactivateUser(userId: string) {
     if (USE_MOCK_DATA) {
       console.log(`Mock deactivating user: ${userId}`);
       return { success: true };
     }
     return await this.put(`/users/${userId}/deactivate`, {});
   }

   async getAuditLogs(page: number, pageSize: number) {
     if (USE_MOCK_DATA) {
       console.log(`Mock fetching audit logs for page ${page}, size ${pageSize}`);
       return { logs: [], totalCount: 0 };
     }
     const response = await this.get(`/audit-logs?page=${page}&pageSize=${pageSize}`);
     return response.data;
   }

   async updateCertificateStatus(certificateId: string, updates: any) {
     if (USE_MOCK_DATA) {
       console.log(`Mock updating certificate ${certificateId} status:`, updates);
       return { success: true };
     }
     return await this.put(`/certificates/${certificateId}/status`, updates);
   }
}

export const localDB = new LocalDB();
