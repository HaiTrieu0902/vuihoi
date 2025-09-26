import { useState } from 'react';
import AuthGuard from '../../guard/AuthGuard';
import DashboardLayout from '../../components/DashboardLayout';

const TranslatePage = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('vi');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleTranslate = () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);

    // Simulate translation API call
    setTimeout(() => {
      setTargetText(`[Translated from ${sourceLang} to ${targetLang}] ${sourceText}`);
      setIsTranslating(false);
    }, 1500);
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    const tempText = sourceText;

    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(targetText);
    setTargetText(tempText);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">🌐 Dịch thuật AI</h1>
              <p className="text-gray-600">Dịch thuật nhanh chóng và chính xác với công nghệ AI tiên tiến</p>
            </div>

            {/* Translation Interface */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Language Selection Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex items-center space-x-4">
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapLanguages}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </button>

                <div className="flex items-center space-x-4">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Translation Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">
                {/* Source Text */}
                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Văn bản gốc</label>
                  <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Nhập văn bản cần dịch..."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{sourceText.length} ký tự</span>
                    <button
                      onClick={handleTranslate}
                      disabled={!sourceText.trim() || isTranslating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTranslating ? (
                        <span className="flex items-center space-x-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Đang dịch...</span>
                        </span>
                      ) : (
                        'Dịch'
                      )}
                    </button>
                  </div>
                </div>

                {/* Target Text */}
                <div className="p-6 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bản dịch</label>
                  <textarea
                    value={targetText}
                    readOnly
                    placeholder="Kết quả dịch sẽ hiển thị tại đây..."
                    className="w-full h-64 p-4 bg-white border border-gray-300 rounded-lg resize-none"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{targetText.length} ký tự</span>
                    {targetText && (
                      <button
                        onClick={() => navigator.clipboard.writeText(targetText)}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        Sao chép
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Translations */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch sử dịch thuật</h2>
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm">Lịch sử dịch thuật sẽ hiển thị tại đây</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
};

export default TranslatePage;
