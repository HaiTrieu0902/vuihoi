import client from '@/services/client';
import { KEY_LOCALSTORAGE_SYNC } from '@/constants';

export interface ChatMessage {
  message: string;
  conversation_id?: string;
  media?: any[];
}

export interface ConversationListItem {
  id: string;
  feature_key: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  content_preview: string | null;
}

export interface ConversationListResponse {
  items: ConversationListItem[];
}

export interface ConversationHistoryResponse {
  conversation_id: string;
  messages: any[];
}

export class ChatService {
  // Get list of conversations
  static async getListChat(): Promise<ConversationListResponse> {
    try {
      const response = await client.get('/api/chat');
      return response.data;
    } catch (error) {
      console.error('Failed to get chat list:', error);
      throw error;
    }
  }

  // Send a chat message (create new conversation or continue existing)
  static async sendMessage(message: ChatMessage): Promise<ReadableStream<Uint8Array> | null> {
    try {
      // Use the same token key as in client.ts
      const authToken = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) || sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.token);
      const response = await fetch(`${client.defaults.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  }

  // Get conversation history by ID
  static async getChatByConversationId(conversationId: string): Promise<ConversationHistoryResponse> {
    try {
      const response = await client.get(`/api/chat/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      throw error;
    }
  }
}
