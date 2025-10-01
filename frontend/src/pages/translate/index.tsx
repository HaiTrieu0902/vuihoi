import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import AuthGuard from '../../guard/AuthGuard';
import { TranslateService } from '../../services/api/translate';

const TranslatePage = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('vi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const languages = [
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setTargetText('');

    try {
      const stream = await TranslateService.translateText({
        text: sourceText,
        source_lang: sourceLang,
        target_lang: targetLang,
        message: 'Please translate the following text:',
      });

      if (!stream) {
        throw new Error('No response stream received');
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let translatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk?.content) {
                translatedText += data.chunk.content;
                setTargetText(translatedText);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTargetText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateUrl = async () => {
    if (!urlInput.trim()) return;

    setIsTranslating(true);
    setTargetText('');

    try {
      const stream = await TranslateService.translateURL({
        url: urlInput,
        source_lang: sourceLang,
        target_lang: targetLang,
        message: 'Please translate the content from this URL:',
      });

      if (!stream) {
        throw new Error('No response stream received');
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let translatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk?.content) {
                translatedText += data.chunk.content;
                setTargetText(translatedText);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('URL translation error:', error);
      setTargetText('URL translation failed. Please check the URL and try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateFile = async () => {
    if (!selectedFile) return;

    setIsTranslating(true);
    setTargetText('');

    try {
      // Convert file to base64 for API
      const fileReader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(selectedFile);
      });

      const media = [
        {
          data: fileData.split(',')[1], // Remove data:type;base64, prefix
          media_type: selectedFile.type,
          filename: selectedFile.name,
        },
      ];

      const stream = await TranslateService.translateFile({
        media,
        source_lang: sourceLang,
        target_lang: targetLang,
        message: 'Please translate the content of this file:',
      });

      if (!stream) {
        throw new Error('No response stream received');
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let translatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk?.content) {
                translatedText += data.chunk.content;
                setTargetText(translatedText);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('File translation error:', error);
      setTargetText('File translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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
      <MainLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">🌐 AI Translation</h1>
              <p className="text-gray-600">Fast and accurate translation with advanced AI technology</p>
            </div>

            {/* Translation Interface */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'text' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📝 Text
                  </button>
                  <button
                    onClick={() => setActiveTab('url')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'url' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔗 URL
                  </button>
                  <button
                    onClick={() => setActiveTab('file')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'file' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📁 File
                  </button>
                </nav>
              </div>

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
                <button onClick={handleSwapLanguages} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
                {/* Source Content */}
                <div className="p-6">
                  {activeTab === 'text' && (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source Text</label>
                      <textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder="Enter text to translate..."
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{sourceText.length} characters</span>
                        <button
                          onClick={handleTranslate}
                          disabled={!sourceText.trim() || isTranslating}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isTranslating ? (
                            <span className="flex items-center space-x-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Translating...</span>
                            </span>
                          ) : (
                            'Translate'
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === 'url' && (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="mt-4 flex flex-col space-y-3">
                        <p className="text-sm text-gray-600">Enter a website URL to translate its content. Supports web pages, articles, and documents.</p>
                        <button
                          onClick={handleTranslateUrl}
                          disabled={!urlInput.trim() || isTranslating}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed self-end"
                        >
                          {isTranslating ? (
                            <span className="flex items-center space-x-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Translating URL...</span>
                            </span>
                          ) : (
                            'Translate URL'
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === 'file' && (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <input type="file" onChange={handleFileSelect} accept=".txt,.pdf,.docx,.md,.html" className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="text-sm text-gray-600">{selectedFile ? selectedFile.name : 'Click to upload a file'}</p>
                            <p className="text-xs text-gray-400">Supports: PDF, DOCX, TXT, MD, HTML</p>
                          </div>
                        </label>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleTranslateFile}
                          disabled={!selectedFile || isTranslating}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isTranslating ? (
                            <span className="flex items-center space-x-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Translating File...</span>
                            </span>
                          ) : (
                            'Translate File'
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Target Text */}
                <div className="p-6 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Translation</label>
                  <textarea
                    value={targetText}
                    readOnly
                    placeholder="Translation result will appear here..."
                    className="w-full h-64 p-4 bg-white border border-gray-300 rounded-lg resize-none"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{targetText.length} characters</span>
                    {targetText && (
                      <button
                        onClick={() => navigator.clipboard.writeText(targetText)}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Translations */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Translation History</h2>
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm">Translation history will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default TranslatePage;
