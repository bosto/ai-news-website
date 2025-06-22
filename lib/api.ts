const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if running in browser
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Articles
  async getArticles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    author?: string;
    tags?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.request(`/articles${query ? `?${query}` : ''}`);
  }

  async getArticleById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/articles/${id}`);
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<any>> {
    return this.request(`/articles/slug/${slug}`);
  }

  async getRelatedArticles(id: string, limit?: number): Promise<ApiResponse<any[]>> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/articles/${id}/related${query}`);
  }

  async getTrendingArticles(limit?: number, days?: number): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (days) params.append('days', days.toString());
    const query = params.toString();
    return this.request(`/articles/trending${query ? `?${query}` : ''}`);
  }

  // Authors
  async getAuthors(page?: number, limit?: number): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    const query = params.toString();
    return this.request(`/authors${query ? `?${query}` : ''}`);
  }

  async getAuthorById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/authors/${id}`);
  }

  async getAuthorArticles(id: string, page?: number, limit?: number): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    const query = params.toString();
    return this.request(`/authors/${id}/articles${query ? `?${query}` : ''}`);
  }

  async getAuthorStats(id: string): Promise<ApiResponse<any>> {
    return this.request(`/authors/${id}/stats`);
  }

  // Categories
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request('/categories');
  }

  async getCategoryById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/categories/${id}`);
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<any>> {
    return this.request(`/categories/slug/${slug}`);
  }

  async getCategoryArticles(id: string, page?: number, limit?: number): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    const query = params.toString();
    return this.request(`/categories/${id}/articles${query ? `?${query}` : ''}`);
  }

  async getCategoryStats(id: string): Promise<ApiResponse<any>> {
    return this.request(`/categories/${id}/stats`);
  }

  // Authentication
  async register(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<ApiResponse<{ user: any; token: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile');
  }

  async updateProfile(email: string): Promise<ApiResponse<any>> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Admin endpoints
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request('/admin/dashboard');
  }

  async createArticle(articleData: any): Promise<ApiResponse<any>> {
    return this.request('/admin/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id: string, articleData: any): Promise<ApiResponse<any>> {
    return this.request(`/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/articles/${id}`, {
      method: 'DELETE',
    });
  }

  async triggerNewsAggregation(): Promise<ApiResponse<any>> {
    return this.request('/admin/news/aggregate', {
      method: 'POST',
    });
  }

  async getNewsSources(): Promise<ApiResponse<any[]>> {
    return this.request('/admin/news-sources');
  }

  async updateNewsSource(id: string, sourceData: any): Promise<ApiResponse<any>> {
    return this.request(`/admin/news-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sourceData),
    });
  }

  async getUsers(page?: number, limit?: number): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    const query = params.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;