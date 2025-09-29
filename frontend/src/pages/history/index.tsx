import AuthGuard from '../../guard/AuthGuard';
import MainLayout from '../../components/MainLayout';
import { ChatService, type ConversationListItem } from '@/services/api/chat';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const response = await ChatService.getListChat();
        setConversations(response.items);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Handle conversation click - navigate to chat with conversation ID
  const handleConversationClick = (conversationId: string) => {
    navigate({ to: '/chat/$conversationId', params: { conversationId } });
  };

  // Filter conversations based on search term and category
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.title?.toLowerCase().includes(searchTerm.toLowerCase()) || conversation.content_preview?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || conversation.feature_key.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Extract category from feature_key and format it
  const getFormattedCategory = (featureKey: string) => {
    const categoryMap: Record<string, string> = {
      'Hỏi Đáp': 'Q&A',
      'Giải Bài Tập': 'Homework',
      'AI Viết Văn': 'Writing',
      Dịch: 'Translation',
      'Tóm Tắt': 'Summary',
      Mindmap: 'Mindmap',
    };
    return categoryMap[featureKey] || featureKey;
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Count estimated messages from content preview
  const getEstimatedMessageCount = (contentPreview: string | null) => {
    if (!contentPreview) return 1;
    // Rough estimate based on content length
    return Math.max(1, Math.ceil(contentPreview.length / 100));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Q&A': 'bg-blue-50 text-blue-600',
      Homework: 'bg-purple-50 text-purple-600',
      Writing: 'bg-green-50 text-green-600',
      Translation: 'bg-pink-50 text-pink-600',
      Summary: 'bg-orange-50 text-orange-600',
      Mindmap: 'bg-indigo-50 text-indigo-600',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-600';
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">📚 Conversation History</h1>
              <p className="text-gray-600">Review your previous conversations and discussions</p>
            </div>

            {/* Filter and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Hỏi Đáp">Q&A</option>
                <option value="Giải Bài Tập">Homework</option>
                <option value="AI Viết Văn">Writing</option>
                <option value="Dịch">Translation</option>
                <option value="Tóm Tắt">Summary</option>
                <option value="Mindmap">Mindmap</option>
              </select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading conversation history...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">{searchTerm || selectedCategory ? 'No conversations found' : 'No conversations yet'}</h3>
                <p className="text-gray-500">{searchTerm || selectedCategory ? 'Try changing your search terms or filters' : 'Start your first conversation!'}</p>
              </div>
            ) : (
              /* Conversations List */
              <div className="space-y-4">
                {filteredConversations.map((conversation) => {
                  const { date, time } = formatDateTime(conversation.created_at);
                  const category = getFormattedCategory(conversation.feature_key);
                  const messageCount = getEstimatedMessageCount(conversation.content_preview);

                  return (
                    <div
                      key={conversation.id}
                      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleConversationClick(conversation.id)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>{category}</span>
                              <span className="text-gray-500 text-sm">{messageCount} messages</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                              {conversation.title || conversation.content_preview || 'Conversation'}
                            </h3>
                            {conversation.content_preview && (
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {conversation.content_preview.length > 100 ? `${conversation.content_preview.substring(0, 100)}...` : conversation.content_preview}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>📅 {date}</span>
                              <span>⏰ {time}</span>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            {!loading && filteredConversations.length > 0 && (
              <div className="text-center mt-8">
                <button onClick={() => navigate({ to: '/chat' })} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4">
                  Start New Conversation
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Refresh List</button>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default HistoryPage;
