import client from '@/services/client';
import { KEY_LOCALSTORAGE_SYNC } from '@/constants';

export interface TranslateTextRequest {
  text: string;
  source_lang: string;
  target_lang: string;
  message?: string;
  conversation_id?: string;
}

export interface TranslateURLRequest {
  url: string;
  source_lang: string;
  target_lang: string;
  message?: string;
  conversation_id?: string;
}

export interface TranslateFileRequest {
  media: any[];
  source_lang: string;
  target_lang: string;
  message?: string;
  conversation_id?: string;
}

export class TranslateService {
  // Translate text
  static async translateText(request: TranslateTextRequest): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const authToken = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) || sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.token);
      const response = await fetch(`${client.defaults.baseURL}/api/translate/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Failed to translate text:', error);
      throw error;
    }
  }

  // Translate URL content
  static async translateURL(request: TranslateURLRequest): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const authToken = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) || sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.token);
      const response = await fetch(`${client.defaults.baseURL}/api/translate/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Failed to translate URL:', error);
      throw error;
    }
  }

  // Translate file
  static async translateFile(request: TranslateFileRequest): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const authToken = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) || sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.token);
      const response = await fetch(`${client.defaults.baseURL}/api/translate/file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Failed to translate file:', error);
      throw error;
    }
  }
}
