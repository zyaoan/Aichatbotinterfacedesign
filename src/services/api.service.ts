import { API_CONFIG, getEndpointUrl } from '../config/api.config';

// Types for API requests and responses
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  sources?: Source[];
  relatedQuestions?: string[];
}

export interface Source {
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  files?: File[];
  model?: 'openai' | 'deepseek' | 'ollama';
}

export interface ChatResponse {
  response: string;
  sources?: Source[];
  relatedQuestions?: string[];
  sessionId?: string;
}

export interface StreamChunk {
  type: 'text' | 'sources' | 'related' | 'done';
  content?: string;
  sources?: Source[];
  relatedQuestions?: string[];
}

// API Service Class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // Send a chat message with streaming support
  async sendMessage(
    request: ChatRequest,
    onChunk?: (chunk: StreamChunk) => void
  ): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append('message', request.message);
    
    if (request.sessionId) {
      formData.append('session_id', request.sessionId);
    }
    
    if (request.model) {
      formData.append('model', request.model);
    }
    
    // Append files if any
    if (request.files && request.files.length > 0) {
      request.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    try {
      // Use fetch with streaming support
      const response = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.CHAT), {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      // Check if response is streaming (Server-Sent Events or chunked)
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream') || contentType?.includes('application/x-ndjson')) {
        // Handle streaming response
        return await this.handleStreamingResponse(response, onChunk);
      } else {
        // Handle regular JSON response
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Handle streaming response (SSE or NDJSON)
  private async handleStreamingResponse(
    response: Response,
    onChunk?: (chunk: StreamChunk) => void
  ): Promise<ChatResponse> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    let fullResponse = '';
    let sources: Source[] = [];
    let relatedQuestions: string[] = [];
    let sessionId: string | undefined;

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            // Try to parse as JSON (for NDJSON format)
            let data;
            if (line.startsWith('data: ')) {
              // SSE format
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') {
                onChunk?.({ type: 'done' });
                continue;
              }
              data = JSON.parse(jsonStr);
            } else {
              // NDJSON format
              data = JSON.parse(line);
            }
            
            // Process the chunk based on type
            if (data.type === 'text' || data.content) {
              fullResponse += data.content || '';
              onChunk?.({ type: 'text', content: data.content });
            } else if (data.type === 'sources' || data.sources) {
              sources = data.sources || [];
              onChunk?.({ type: 'sources', sources });
            } else if (data.type === 'related' || data.relatedQuestions) {
              relatedQuestions = data.relatedQuestions || data.related_questions || [];
              onChunk?.({ type: 'related', relatedQuestions });
            } else if (data.session_id) {
              sessionId = data.session_id;
            }
          } catch (e) {
            // If not valid JSON, treat as plain text chunk
            fullResponse += line;
            onChunk?.({ type: 'text', content: line });
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    onChunk?.({ type: 'done' });

    return {
      response: fullResponse,
      sources,
      relatedQuestions,
      sessionId,
    };
  }

  // Upload files
  async uploadFiles(files: File[]): Promise<{ fileIds: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.UPLOAD), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get chat history
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    const response = await fetch(
      getEndpointUrl(`${API_CONFIG.ENDPOINTS.HISTORY}/${sessionId}`),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get chat history: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get all sessions
  async getSessions(): Promise<Array<{ id: string; title: string; timestamp: number }>> {
    const response = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.SESSIONS), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get sessions: ${response.statusText}`);
    }

    return await response.json();
  }

  // Create a new session
  async createSession(): Promise<{ sessionId: string }> {
    const response = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.SESSIONS), {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    return await response.json();
  }

  // Delete a session
  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(
      getEndpointUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}/${sessionId}`),
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.statusText}`);
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();
