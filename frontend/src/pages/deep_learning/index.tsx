import AuthGuard from '../../guard/AuthGuard';
import DashboardLayout from '../../components/DashboardLayout';

const DeepLearningPage = () => {
  const topics = [
    {
      title: 'Lập trình viên dùng AI',
      subtitle: 'Thay đổi và cơ hội ngành code',
      icon: '💻',
      category: 'Programming',
    },
    {
      title: 'Cake biến AI thành xương sống vận hành ngân hàng số',
      subtitle: 'Fintech & AI Innovation',
      icon: '🏦',
      category: 'Fintech',
    },
    {
      title: 'Chatbot AI có thực sự tiêu thu nhiều điện năng?',
      subtitle: 'Energy & Sustainability',
      icon: '⚡',
      category: 'Energy',
    },
    {
      title: 'Machine Learning cơ bản',
      subtitle: 'Thuật toán và ứng dụng thực tế',
      icon: '🤖',
      category: 'ML Basics',
    },
    {
      title: 'Neural Networks',
      subtitle: 'Mạng neuron nhân tạo và deep learning',
      icon: '🧠',
      category: 'Neural Networks',
    },
    {
      title: 'Computer Vision',
      subtitle: 'Xử lý hình ảnh với AI',
      icon: '👁️',
      category: 'Computer Vision',
    },
  ];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">🧠 AI & Công nghệ</h1>
              <p className="text-gray-600">
                Khám phá thế giới Deep Learning, Machine Learning và các công nghệ AI tiên tiến
              </p>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {['Tất cả', 'Programming', 'Fintech', 'Energy', 'ML Basics', 'Neural Networks', 'Computer Vision'].map(
                  (category) => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        category === 'Tất cả' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{topic.icon}</div>
                      <div className="flex-1">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-2">
                          {topic.category}
                        </span>
                        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{topic.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                      Tìm hiểu thêm →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Section */}
            <div className="mt-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg text-white p-8">
              <h2 className="text-2xl font-bold mb-4">🚀 Bắt đầu hành trình AI của bạn</h2>
              <p className="text-purple-100 mb-6">
                Từ những khái niệm cơ bản đến các ứng dụng nâng cao, OpenHay sẽ đồng hành cùng bạn khám phá thế giới trí
                tuệ nhân tạo.
              </p>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Bắt đầu học ngay
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
};

export default DeepLearningPage;
