import AuthGuard from '../../guard/AuthGuard';
import DashboardLayout from '../../components/DashboardLayout';

const ChatPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">🤖 AI Hội đáp</h1>
            <p className="text-gray-600 text-sm">Chat với AI thông minh để giải đáp thắc mắc</p>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm border overflow-y-auto p-4">
                <div className="text-center text-gray-500 mt-20">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-lg font-medium mb-2">Bắt đầu cuộc trò chuyện</h3>
                  <p className="text-sm">Hãy đặt câu hỏi bất kỳ để AI giúp bạn giải đáp!</p>
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      placeholder="Nhập tin nhắn của bạn..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
};

export default ChatPage;
