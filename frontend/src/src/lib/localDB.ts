// Local database service that communicates with our Express backend

interface User {
  [key: string]: unknown;
}

class LocalDB {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3004/api/v1';
  }

  private getToken(): string | null {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.token || null;
    }
    return null;
  }

  // Generic method for GET requests
  private async get<T>(endpoint: string): Promise<T> {
    try {
      const token = this.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }

  // Generic method for POST requests
  private async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const token = this.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }

  // Generic method for PUT requests
  private async put<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const token = this.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error putting to ${endpoint}:`, error);
      throw error;
    }
  }

  // Generic method for PATCH requests
  private async patch<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const token = this.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error patching to ${endpoint}:`, error);
      throw error;
    }
  }

  // Methods for users
  public async getUsers(): Promise<unknown> {
    return this.get('/users');
  }

  public async getUserById(id: string): Promise<unknown> {
    return this.get(`/users/${id}`);
  }

  public async createUser(user: Omit<User, 'id' | 'status'>): Promise<unknown> {
    return this.post('/users', user);
  }

  public async updateUser(id: string, updates: unknown): Promise<unknown> {
    return this.put(`/users/${id}`, updates);
  }

  public async deactivateUser(id: string): Promise<unknown> {
    return this.patch(`/users/${id}/deactivate`, {});
  }

  // Methods for certificates
  public async getCertificates(): Promise<unknown> {
    return this.get('/certificates');
  }

  public async getCertificatesByStudentId(studentId: string): Promise<unknown> {
    return this.get(`/certificates/student/${studentId}`);
  }

  public async createCertificate(certificate: unknown): Promise<unknown> {
    return this.post('/certificates', certificate);
  }

  public async updateCertificateStatus(id: string, statusData: unknown): Promise<unknown> {
    return this.patch(`/certificates/${id}/status`, statusData);
  }

  // Methods for audit logs
  public async getAuditLogs(page: number, pageSize: number): Promise<unknown> {
    return this.get(`/audit-logs?page=${page}&pageSize=${pageSize}`);
  }

}

// Create a singleton instance
export const localDB = new LocalDB();
