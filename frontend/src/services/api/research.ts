import client from '@/services/client';
import { KEY_LOCALSTORAGE_SYNC } from '@/constants';

export interface ResearchRequest {
  query: string;
  conversation_id?: string;
  media?: any[];
}

export interface ResearchStreamEvent {
  event: string;
  data: any;
}

// Event types that can be received from the research stream
export interface LeadThinkingEvent {
  thinking: string;
}

export interface LeadAnswerEvent {
  answer: string;
}

export interface WebSearchQueryEvent {
  id: string;
  index: number;
  query: string;
}

export interface WebSearchResultsEvent {
  id: string;
  index: number;
  results: any[];
}

export interface SubagentCompletedEvent {
  // Empty object - just signals completion
}

export interface FinalReportEvent {
  report: string;
}

export interface ConversationCreatedEvent {
  conversation_id: string;
}

export class ResearchService {
  /**
   * Start a research session and return a readable stream of events
   */
  static async startResearch(request: ResearchRequest): Promise<ReadableStream<Uint8Array> | null> {
    try {
      // Get auth token from localStorage or sessionStorage
      const authToken = localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) || sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.token);

      const response = await fetch(`${client.defaults.baseURL}/api/research`, {
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
      console.error('Failed to start research:', error);
      throw error;
    }
  }

  /**
   * Parse Server-Sent Events from the research stream
   */
  static parseSSEEvent(chunk: string): ResearchStreamEvent | null {
    const lines = chunk.split('\n');
    let event = '';
    let data = '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        data = line.substring(5).trim();
      }
    }

    if (event && data) {
      try {
        return {
          event,
          data: JSON.parse(data),
        };
      } catch (error) {
        console.error('Failed to parse SSE data:', error);
        return null;
      }
    }

    return null;
  }

  /**
   * Process research stream with event handlers
   */
  static async processResearchStream(
    stream: ReadableStream<Uint8Array>,
    handlers: {
      onLeadThinking?: (data: LeadThinkingEvent) => void;
      onLeadAnswer?: (data: LeadAnswerEvent) => void;
      onWebSearchQuery?: (data: WebSearchQueryEvent) => void;
      onWebSearchResults?: (data: WebSearchResultsEvent) => void;
      onSubagentCompleted?: (data: SubagentCompletedEvent) => void;
      onFinalReport?: (data: FinalReportEvent) => void;
      onConversationCreated?: (data: ConversationCreatedEvent) => void;
      onError?: (error: Error) => void;
    },
  ): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete events in the buffer
        const events = buffer.split('\n\n');

        // Keep the last potentially incomplete event in buffer
        buffer = events.pop() || '';

        for (const eventChunk of events) {
          if (eventChunk.trim()) {
            const event = this.parseSSEEvent(eventChunk);

            if (event) {
              switch (event.event) {
                case 'lead_thinking':
                  handlers.onLeadThinking?.(event.data);
                  break;
                case 'lead_answer':
                  handlers.onLeadAnswer?.(event.data);
                  break;
                case 'web_search_query':
                  handlers.onWebSearchQuery?.(event.data);
                  break;
                case 'web_search_results':
                  handlers.onWebSearchResults?.(event.data);
                  break;
                case 'subagent_completed':
                  handlers.onSubagentCompleted?.(event.data);
                  break;
                case 'final_report':
                  handlers.onFinalReport?.(event.data);
                  break;
                case 'conversation_created':
                  handlers.onConversationCreated?.(event.data);
                  break;
                default:
                  console.log('Unknown event type:', event.event, event.data);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing research stream:', error);
      handlers.onError?.(error as Error);
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Convenience method to run research with a simple callback for final results
   */
  static async runResearch(
    query: string,
    options: {
      conversationId?: string;
      media?: any[];
      onProgress?: (event: ResearchStreamEvent) => void;
      onFinalReport?: (report: string) => void;
      onError?: (error: Error) => void;
    } = {},
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await this.startResearch({
          query,
          conversation_id: options.conversationId,
          media: options.media || [],
        });

        if (!stream) {
          throw new Error('Failed to get research stream');
        }

        let finalReport = '';

        await this.processResearchStream(stream, {
          onLeadThinking: (data) => {
            options.onProgress?.({ event: 'lead_thinking', data });
          },
          onLeadAnswer: (data) => {
            options.onProgress?.({ event: 'lead_answer', data });
          },
          onWebSearchQuery: (data) => {
            options.onProgress?.({ event: 'web_search_query', data });
          },
          onWebSearchResults: (data) => {
            options.onProgress?.({ event: 'web_search_results', data });
          },
          onSubagentCompleted: (data) => {
            options.onProgress?.({ event: 'subagent_completed', data });
          },
          onFinalReport: (data) => {
            finalReport = data.report;
            options.onFinalReport?.(data.report);
            options.onProgress?.({ event: 'final_report', data });
          },
          onConversationCreated: (data) => {
            options.onProgress?.({ event: 'conversation_created', data });
          },
          onError: (error) => {
            options.onError?.(error);
            reject(error);
          },
        });

        resolve(finalReport);
      } catch (error) {
        options.onError?.(error as Error);
        reject(error);
      }
    });
  }
}
