import { createFileRoute } from '@tanstack/react-router';
import ChatPage from '../pages/chat';

// Define the search params type for optional conversation ID
export interface ChatSearchParams {
  conversationId?: string;
}

export const Route = createFileRoute('/chat')({
  component: ChatPage,
  validateSearch: (search: Record<string, unknown>): ChatSearchParams => {
    return {
      conversationId: (search.conversationId as string) || undefined,
    };
  },
});
