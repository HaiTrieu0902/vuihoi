import { ChatService, type ConversationListItem } from '@/services/api/chat';
import { Chat as ChatIcon, ChevronRight as ChevronRightIcon, History as HistoryIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Fade, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import AuthGuard from '../../guard/AuthGuard';

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

  const getCategoryMUIColor = (category: string) => {
    const colors = {
      'Q&A': { bg: '#dbeafe', text: '#2563eb' },
      Homework: { bg: '#f3e8ff', text: '#9333ea' },
      Writing: { bg: '#dcfce7', text: '#16a34a' },
      Translation: { bg: '#fce7f3', text: '#db2777' },
      Summary: { bg: '#fed7aa', text: '#ea580c' },
      Mindmap: { bg: '#e0e7ff', text: '#4f46e5' },
    };
    return colors[category as keyof typeof colors] || { bg: '#f9fafb', text: '#6b7280' };
  };

  return (
    <AuthGuard>
      <MainLayout>
        <Box
          sx={{
            height: 'calc(100vh - 40px)',
            maxWidth: '1200px',
            mx: 'auto',
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#10b981',
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                <HistoryIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}
                >
                  Conversation History
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                >
                  Review your previous conversations and discussions
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Filter and Search */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#9ca3af', mr: 1 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  },
                },
              }}
            />
            <FormControl
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category">
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Hỏi Đáp">Q&A</MenuItem>
                <MenuItem value="Giải Bài Tập">Homework</MenuItem>
                <MenuItem value="AI Viết Văn">Writing</MenuItem>
                <MenuItem value="Dịch">Translation</MenuItem>
                <MenuItem value="Tóm Tắt">Summary</MenuItem>
                <MenuItem value="Mindmap">Mindmap</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Loading State */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 12,
              }}
            >
              <CircularProgress sx={{ color: '#10b981' }} />
              <Typography sx={{ ml: 2, color: '#6b7280' }}>Loading conversation history...</Typography>
            </Box>
          ) : filteredConversations.length === 0 ? (
            <Fade in timeout={800}>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    fontSize: '4rem',
                    mb: 3,
                    opacity: 0.6,
                  }}
                >
                  💬
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    color: '#6b7280',
                    mb: 2,
                  }}
                >
                  {searchTerm || selectedCategory ? 'No conversations found' : 'No conversations yet'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#9ca3af',
                    mb: 4,
                  }}
                >
                  {searchTerm || selectedCategory ? 'Try changing your search terms or filters' : 'Start your first conversation!'}
                </Typography>
                {!searchTerm && !selectedCategory && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate({ to: '/chat' })}
                    sx={{
                      backgroundColor: '#10b981',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#059669',
                      },
                    }}
                  >
                    Start New Conversation
                  </Button>
                )}
              </Box>
            </Fade>
          ) : (
            /* Conversations List */
            <Box sx={{ space: 2 }}>
              {filteredConversations.map((conversation, index) => {
                const { date, time } = formatDateTime(conversation.created_at);
                const category = getFormattedCategory(conversation.feature_key);
                const messageCount = getEstimatedMessageCount(conversation.content_preview);

                return (
                  <Fade in timeout={300 + index * 100} key={conversation.id}>
                    <Card
                      sx={{
                        mb: 2,
                        borderRadius: '16px',
                        border: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => handleConversationClick(conversation.id)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Chip
                                label={category}
                                size="small"
                                sx={{
                                  backgroundColor: getCategoryMUIColor(category).bg,
                                  color: getCategoryMUIColor(category).text,
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              />
                              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                {messageCount} messages
                              </Typography>
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: '#111827',
                                mb: 1,
                                fontSize: '1.1rem',
                                '&:hover': {
                                  color: '#10b981',
                                },
                                transition: 'color 0.2s ease',
                              }}
                            >
                              {conversation.title || conversation.content_preview || 'Conversation'}
                            </Typography>
                            {conversation.content_preview && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6b7280',
                                  mb: 2,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  fontSize: '0.875rem',
                                  lineHeight: 1.5,
                                }}
                              >
                                {conversation.content_preview.length > 100 ? `${conversation.content_preview.substring(0, 100)}...` : conversation.content_preview}
                              </Typography>
                            )}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#9ca3af',
                                  fontSize: '0.875rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                📅 {date}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#9ca3af',
                                  fontSize: '0.875rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                ⏰ {time}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            sx={{
                              color: '#d1d5db',
                              '&:hover': {
                                color: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              },
                            }}
                          >
                            <ChevronRightIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                );
              })}
            </Box>
          )}

          {/* Actions */}
          {!loading && filteredConversations.length > 0 && (
            <Box
              sx={{
                textAlign: 'center',
                mt: 6,
                pt: 4,
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate({ to: '/chat' })}
                startIcon={<ChatIcon />}
                sx={{
                  backgroundColor: '#10b981',
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  mr: 2,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                Start New Conversation
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
                sx={{
                  borderColor: '#d1d5db',
                  color: '#374151',
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#9ca3af',
                  },
                }}
              >
                Refresh List
              </Button>
            </Box>
          )}

          <Box sx={{ height: 20, mt: 2 }}></Box>
        </Box>
      </MainLayout>
    </AuthGuard>
  );
};

export default HistoryPage;
