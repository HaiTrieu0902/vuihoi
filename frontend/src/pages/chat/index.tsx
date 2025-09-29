import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Fade, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import MainLayout from '../../components/MainLayout';
import AuthGuard from '../../guard/AuthGuard';
import { ChatService, type ChatMessage } from '@/services/api/chat';

const ChatPage = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false });

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Get conversation ID from URL params or search params
  const urlConversationId = params?.conversationId || search?.conversationId;
  const [conversationId, setConversationId] = useState<string | undefined>(urlConversationId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessageId = Date.now();
    const aiMessageId = userMessageId + 1;

    const userMessage = {
      id: userMessageId,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      // Prepare message for API
      const chatMessage: ChatMessage = {
        message: currentMessage,
        conversation_id: conversationId,
        media: [],
      };

      // Send message to backend
      const stream = await ChatService.sendMessage(chatMessage);

      if (!stream) {
        throw new Error('No response stream received');
      }

      // Process Server-Sent Events
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';
      let currentConversationId = conversationId;
      let aiMessageAdded = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          console.log('Raw chunk:', chunk); // Debug log

          // Split by double newlines to separate events
          const events = chunk.split('\n\n');

          for (const event of events) {
            if (!event.trim()) continue;

            const lines = event.split('\n');
            let eventType = '';
            let eventData = '';

            // Parse SSE format
            for (const line of lines) {
              if (line.startsWith('event: ')) {
                eventType = line.slice(7).trim();
              } else if (line.startsWith('data: ')) {
                eventData = line.slice(6).trim();
              }
            }

            console.log('Event type:', eventType, 'Data:', eventData); // Debug log

            if (!eventData) continue;

            try {
              const data = JSON.parse(eventData);

              // Handle conversation creation
              if (eventType === 'conversation_created' && data.conversation_id) {
                currentConversationId = data.conversation_id;
                setConversationId(currentConversationId);
                console.log('Conversation created:', currentConversationId);

                // Navigate to the conversation URL if we're not already there
                if (!urlConversationId && currentConversationId) {
                  navigate({ to: '/chat/$conversationId', params: { conversationId: currentConversationId } });
                }
              }
              // Handle AI message chunks
              else if (eventType === 'ai_message' && data.chunk?.content) {
                aiResponseText += data.chunk.content;
                console.log('AI chunk:', data.chunk.content, 'Full text so far:', aiResponseText);

                // Update or add AI message in real-time
                setMessages((prev) => {
                  const filtered = prev.filter((m) => m.id !== aiMessageId);
                  return [
                    ...filtered,
                    {
                      id: aiMessageId,
                      text: aiResponseText,
                      isUser: false,
                      timestamp: new Date(),
                    },
                  ];
                });
                aiMessageAdded = true;
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', parseError, 'Data:', eventData);
            }
          }
        }
      } finally {
        reader.releaseLock();
        setIsTyping(false);

        // Ensure final AI message is added if we received content but didn't add it yet
        if (aiResponseText && !aiMessageAdded) {
          setMessages((prev) => {
            // Check if message already exists
            const existingMessage = prev.find((m) => m.id === aiMessageId);
            if (existingMessage) {
              return prev; // Message already exists
            }
            return [
              ...prev,
              {
                id: aiMessageId,
                text: aiResponseText,
                isUser: false,
                timestamp: new Date(),
              },
            ];
          });
        }

        console.log('Final AI response:', aiResponseText); // Debug log
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);

      // Show error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 100, // Different ID to avoid conflicts
          text: 'Sorry, there was an error processing your message. Please try again.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const quickPrompts = [
    { icon: '�', text: 'Explain machine learning basics', category: 'Learning' },
    { icon: '🚀', text: 'How to start with React development?', category: 'Programming' },
    { icon: '🧠', text: 'What is artificial intelligence?', category: 'AI' },
    { icon: '🎯', text: 'Best practices for coding', category: 'Development' },
    { icon: '🔍', text: 'Help me debug this code', category: 'Debug' },
    { icon: '📚', text: 'Recommend learning resources', category: 'Resources' },
  ];

  // Load conversation list on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await ChatService.getListChat();
        console.log('Available conversations:', response.items);
        // You can use this data to show conversation history in sidebar
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };

    loadConversations();
  }, []);

  // Load conversation history when conversation ID is present in URL
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (conversationId) {
        try {
          console.log('Loading conversation history for:', conversationId);
          const response = await ChatService.getChatByConversationId(conversationId);

          // Convert the backend message format to frontend format
          const convertedMessages: Array<{ id: number; text: string; isUser: boolean; timestamp: Date }> = [];
          let messageId = Date.now();

          response.messages.forEach((msg: any) => {
            if (msg.part_kind === 'user-prompt' && Array.isArray(msg.content)) {
              // User message
              convertedMessages.push({
                id: messageId++,
                text: msg.content.join(' '),
                isUser: true,
                timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              });
            } else if (msg.part_kind === 'text' && typeof msg.content === 'string' && msg.content.trim()) {
              // AI response (skip empty content and thinking parts)
              convertedMessages.push({
                id: messageId++,
                text: msg.content,
                isUser: false,
                timestamp: new Date(), // AI responses don't have timestamps, use current time
              });
            }
            // Skip 'thinking' parts as they are internal AI reasoning
          });

          setMessages(convertedMessages);
          console.log('Loaded conversation history:', convertedMessages);
        } catch (error) {
          console.error('Failed to load conversation history:', error);
        }
      }
    };

    loadConversationHistory();
  }, [conversationId]);

  // Update conversation ID when URL changes
  useEffect(() => {
    if (urlConversationId && urlConversationId !== conversationId) {
      setConversationId(urlConversationId);
    }
  }, [urlConversationId, conversationId]);
  return (
    <AuthGuard>
      <MainLayout>
        <Box
          sx={{
            height: 'calc(100vh - 40px)',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '800px',
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Header with New Chat button */}
          {conversationId && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: { xs: 2, sm: 3 },
                py: 1,
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Typography variant="h6" sx={{ color: '#374151', fontSize: '1rem' }}>
                Conversation: {conversationId.slice(0, 8)}...
              </Typography>
              <IconButton
                onClick={() => {
                  setMessages([]);
                  setConversationId(undefined);
                  navigate({ to: '/chat' });
                }}
                sx={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  '&:hover': {
                    backgroundColor: '#e5e7eb',
                  },
                }}
              >
                <Box sx={{ fontSize: '0.9rem', fontWeight: 500 }}>New Chat</Box>
              </IconButton>
            </Box>
          )}

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                px: { xs: 2, sm: 3 },
                py: 2,
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#d1d5db',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#9ca3af',
                },
              }}
            >
              {messages.length === 0 ? (
                <Fade in timeout={800}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: { xs: 4, sm: 8 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '60vh',
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4,
                        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <Typography sx={{ fontSize: '2rem' }}>🤖</Typography>
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: '#111827',
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                      }}
                    >
                      How can I help you today?
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 6,
                        maxWidth: 500,
                        color: '#6b7280',
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                      }}
                    >
                      I'm your AI assistant. Ask me anything about programming, technology, or general topics.
                    </Typography>

                    {/* View History Button */}
                    <Box sx={{ mb: 4 }}>
                      <IconButton
                        onClick={() => navigate({ to: '/history' })}
                        sx={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#e5e7eb',
                          },
                        }}
                      >
                        <Box sx={{ fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>📚 View Conversation History</Box>
                      </IconButton>
                    </Box>

                    {/* Quick Prompts Grid */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                        gap: 1.5,
                        maxWidth: 700,
                        width: '100%',
                      }}
                    >
                      {quickPrompts.map((prompt, index) => (
                        <Card
                          key={index}
                          sx={{
                            cursor: 'pointer',
                            border: '1px solid #f0f0f0',
                            borderRadius: 2.5,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              borderColor: '#10b981',
                              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.12)',
                              transform: 'translateY(-4px) scale(1.02)',
                              backgroundColor: 'white',
                            },
                          }}
                          onClick={() => setMessage(prompt.text)}
                        >
                          <CardContent sx={{ p: 2.5, textAlign: 'left', '&:last-child': { pb: 2.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <Box
                                sx={{
                                  fontSize: '1.1rem',
                                  mr: 1.5,
                                  width: 28,
                                  height: 28,
                                  borderRadius: 1.5,
                                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {prompt.icon}
                              </Box>
                              <Chip
                                label={prompt.category}
                                size="small"
                                sx={{
                                  height: 20,
                                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                  color: '#059669',
                                  fontSize: '0.7rem',
                                  fontWeight: 500,
                                  border: 'none',
                                  '& .MuiChip-label': {
                                    px: 1,
                                  },
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#374151',
                                fontWeight: 500,
                                fontSize: '0.85rem',
                                lineHeight: 1.4,
                              }}
                            >
                              {prompt.text}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </Fade>
              ) : (
                <Box sx={{ pb: 4 }}>
                  {messages.map((msg) => (
                    <Fade in key={msg.id} timeout={300}>
                      <Box
                        sx={{
                          mb: 4,
                          display: 'flex',
                          flexDirection: msg.isUser ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: msg.isUser ? '#3b82f6' : '#10b981',
                            color: 'white',
                            fontSize: '0.9rem',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {msg.isUser ? '👤' : '🤖'}
                        </Avatar>

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            maxWidth: msg.isUser ? '75%' : '85%',
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: msg.isUser ? '#f0f9ff' : '#f9fafb',
                              border: `1px solid ${msg.isUser ? '#e0f2fe' : '#f3f4f6'}`,
                              borderRadius: 2.5,
                              p: 2,
                              mb: 0.5,
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                color: '#374151',
                                lineHeight: 1.6,
                                fontSize: '0.9rem',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                margin: 0,
                              }}
                            >
                              {msg.text}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#9ca3af',
                              fontSize: '0.7rem',
                              ml: 1,
                            }}
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <Fade in>
                      <Box
                        sx={{
                          mb: 4,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: '#10b981',
                            color: 'white',
                            fontSize: '0.9rem',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          🤖
                        </Avatar>
                        <Box
                          sx={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #f3f4f6',
                            borderRadius: 2.5,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          <CircularProgress size={14} thickness={4} sx={{ color: '#10b981' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#6b7280',
                              fontStyle: 'italic',
                              fontSize: '0.85rem',
                            }}
                          >
                            Thinking...
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>
                  )}

                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Box>
          </Box>

          {/* Chat Input - ChatGPT Style */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 3,
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'transparent',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '800px',
                mx: 'auto',
                backgroundColor: '#f7f7f8',
                borderRadius: '26px',
                border: '1px solid #d1d5db',
                px: 2,
                py: 1,
                minHeight: '52px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                '&:focus-within': {
                  backgroundColor: 'white',
                  border: '1px solid #10b981',
                  boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.1)',
                },
              }}
            >
              {/* Plus Button */}
              <IconButton
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  color: '#6b7280',
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </Box>
              </IconButton>

              {/* Text Input */}
              <TextField
                fullWidth
                multiline
                maxRows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything"
                variant="standard"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                sx={{
                  '& .MuiInput-root': {
                    fontSize: '1rem',
                    '&:before': {
                      display: 'none',
                    },
                    '&:after': {
                      display: 'none',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      display: 'none',
                    },
                  },
                  '& .MuiInput-input': {
                    padding: '12px 8px',
                    '&::placeholder': {
                      color: '#9ca3af',
                      opacity: 1,
                      fontSize: '1rem',
                    },
                  },
                }}
              />

              {/* Right Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                {/* Attach Button */}
                <IconButton
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    color: '#6b7280',
                    '&:hover': {
                      backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    },
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>

                {/* Microphone Button */}
                <IconButton
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    color: '#6b7280',
                    '&:hover': {
                      backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '1.1rem',
                      height: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    🎤
                  </Box>
                </IconButton>

                {/* Send Button */}
                {message.trim() && (
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: '#10b981',
                      color: 'white',
                      ml: 0.5,
                      '&:hover': {
                        backgroundColor: '#059669',
                      },
                      '&:disabled': {
                        backgroundColor: '#e5e7eb',
                        color: '#9ca3af',
                      },
                    }}
                  >
                    <SendIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Bottom Text */}
            <Typography
              variant="caption"
              sx={{
                color: '#9ca3af',
                fontSize: '0.75rem',
                mt: 2,
                display: 'block',
                textAlign: 'center',
                fontWeight: 400,
              }}
            >
              VUIHOI AI can make mistakes. Check important info.
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    </AuthGuard>
  );
};

export default ChatPage;
