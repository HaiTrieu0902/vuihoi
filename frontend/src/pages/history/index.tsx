import AuthGuard from '../../guard/AuthGuard';
import MainLayout from '../../components/MainLayout';

const HistoryPage = () => {
  const conversations = [
    {
      id: 1,
      title: 'Hướng dẫn lập trình Python cơ bản',
      date: '2024-09-25',
      time: '10:30',
      messageCount: 15,
      category: 'Programming',
    },
    {
      id: 2,
      title: 'Giải thích thuật toán Machine Learning',
      date: '2024-09-24',
      time: '14:20',
      messageCount: 23,
      category: 'AI',
    },
    {
      id: 3,
      title: 'Tư vấn chọn ngành học đại học',
      date: '2024-09-23',
      time: '16:45',
      messageCount: 8,
      category: 'Education',
    },
    {
      id: 4,
      title: 'Hỏi về cách đầu tư chứng khoán',
      date: '2024-09-22',
      time: '09:15',
      messageCount: 12,
      category: 'Finance',
    },
    {
      id: 5,
      title: 'Dịch văn bản tiếng Anh sang tiếng Việt',
      date: '2024-09-21',
      time: '20:30',
      messageCount: 5,
      category: 'Translation',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Programming: 'bg-blue-50 text-blue-600',
      AI: 'bg-purple-50 text-purple-600',
      Education: 'bg-green-50 text-green-600',
      Finance: 'bg-orange-50 text-orange-600',
      Translation: 'bg-pink-50 text-pink-600',
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
              <h1 className="text-2xl font-bold text-gray-800 mb-2">📚 Lịch sử cuộc trò chuyện</h1>
              <p className="text-gray-600">Xem lại các cuộc trò chuyện và câu hỏi đã thảo luận trước đây</p>
            </div>

            {/* Filter and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tất cả danh mục</option>
                <option value="programming">Programming</option>
                <option value="ai">AI</option>
                <option value="education">Education</option>
                <option value="finance">Finance</option>
                <option value="translation">Translation</option>
              </select>
            </div>

            {/* Conversations List */}
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(conversation.category)}`}>{conversation.category}</span>
                          <span className="text-gray-500 text-sm">{conversation.messageCount} tin nhắn</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{conversation.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 {conversation.date}</span>
                          <span>⏰ {conversation.time}</span>
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
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Xem thêm cuộc trò chuyện</button>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default HistoryPage;
