// API configuration - Updated for local testing
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Debug logging
console.log('API_BASE_URL:', API_BASE_URL);
console.log('REACT_APP_API_URL env var:', process.env.REACT_APP_API_URL);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  sessionId: string;
  riskLevel: {
    level: 'low' | 'moderate' | 'high' | 'unknown';
    message: string;
    requiresImmediateAttention: boolean;
  };
  timestamp: string;
}

export interface StartConversationResponse {
  success: boolean;
  sessionId: string;
  message: string;
  timestamp: string;
}

export interface ConversationHistoryResponse {
  success: boolean;
  sessionId: string;
  messages: ChatMessage[];
  messageCount: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Start a new conversation
  async startConversation(): Promise<StartConversationResponse> {
    return this.request<StartConversationResponse>('/chat/start', {
      method: 'POST',
    });
  }

  // Send a message and get AI response
  async sendMessage(message: string, sessionId: string, systemPrompt?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, systemPrompt }),
    });
  }

  // Get conversation history
  async getConversationHistory(sessionId: string): Promise<ConversationHistoryResponse> {
    return this.request<ConversationHistoryResponse>(`/chat/history/${sessionId}`);
  }

  // Clear conversation history
  async clearConversation(sessionId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/chat/clear/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request<{ status: string; message: string; timestamp: string }>('/health');
  }

  // Get address from coordinates
  async getAddressFromCoords(lat: number, lng: number): Promise<{ address: string }> {
    return this.request<{ address: string }>(`/location/address?lat=${lat}&lng=${lng}`);
  }

  // Search locations
  async searchLocations(query: string): Promise<{ addresses: Array<{ roadAddress: string; jibunAddress: string; displayAddress: string }> }> {
    return this.request<{ addresses: Array<{ roadAddress: string; jibunAddress: string; displayAddress: string }> }>(`/location/search?query=${encodeURIComponent(query)}`);
  }

  // Search nearby mental health facilities
  async searchNearbyFacilities(lat: number, lng: number, radius: number = 5000): Promise<{
    facilities: Array<{
      id: string;
      name: string;
      type: 'psychiatrist' | 'counselor';
      address: string;
      roadAddress: string;
      phone: string;
      category: string;
      distance: string;
      coordinates: { lat: number; lng: number };
    }>;
    totalCount: number;
    searchLocation: { lat: number; lng: number };
  }> {
    return this.request<{
      facilities: Array<{
        id: string;
        name: string;
        type: 'psychiatrist' | 'counselor';
        address: string;
        roadAddress: string;
        phone: string;
        category: string;
        distance: string;
        coordinates: { lat: number; lng: number };
      }>;
      totalCount: number;
      searchLocation: { lat: number; lng: number };
    }>(`/location/nearby-facilities?lat=${lat}&lng=${lng}&radius=${radius}`);
  }
}

export const apiService = new ApiService();
export default apiService; 