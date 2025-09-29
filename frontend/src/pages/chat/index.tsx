import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Fade, IconButton, InputAdornment, Paper, TextField, Typography, alpha, useTheme } from '@mui/material';
import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import AuthGuard from '../../guard/AuthGuard';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>>([]);
  const theme = useTheme();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I'm here to help! This is a demo response. I can assist you with programming, AI concepts, general questions, and much more.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const quickPrompts = [
    { icon: '💻', text: 'Explain machine learning basics' },
    { icon: '🚀', text: 'How to start with React development?' },
    { icon: '🧠', text: 'What is artificial intelligence?' },
    { icon: '🎯', text: 'Best practices for coding' },
  ];

  return (
    <AuthGuard>
      <MainLayout>
        <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <Fade in timeout={600}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ fontSize: '2.5rem', mr: 2 }}>🤖</Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #2d3748 30%, #4a5568 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                    }}
                  >
                    AI Assistant
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Chat with intelligent AI to get instant answers and insights
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(102, 126, 234, 0.1)' }} />
            </Box>
          </Fade>

          {/* Messages Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 3 }}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                {messages.length === 0 ? (
                  <Fade in timeout={800}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
                          mb: 3,
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        🤖
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: '#2d3748',
                          fontSize: { xs: '1.2rem', sm: '1.4rem' },
                        }}
                      >
                        Start Your Conversation
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                        Ask me anything! I can help with programming, explain concepts, solve problems, or just have a friendly chat.
                      </Typography>

                      {/* Quick Prompts */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        {quickPrompts.map((prompt, index) => (
                          <Chip
                            key={index}
                            icon={<Box sx={{ fontSize: '1rem' }}>{prompt.icon}</Box>}
                            label={prompt.text}
                            variant="outlined"
                            clickable
                            onClick={() => setMessage(prompt.text)}
                            sx={{
                              borderColor: 'rgba(102, 126, 234, 0.2)',
                              color: '#4a5568',
                              fontWeight: 500,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                borderColor: theme.palette.primary.main,
                                transform: 'translateY(-1px)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Fade>
                ) : (
                  <Box sx={{ space: 2 }}>
                    {messages.map((msg) => (
                      <Fade in key={msg.id} timeout={400}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              maxWidth: '80%',
                              gap: 1,
                              flexDirection: msg.isUser ? 'row-reverse' : 'row',
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: '1rem',
                                backgroundColor: msg.isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.1)',
                                color: msg.isUser ? 'white' : '#667eea',
                              }}
                            >
                              {msg.isUser ? '👤' : '🤖'}
                            </Avatar>
                            <Card
                              elevation={0}
                              sx={{
                                backgroundColor: msg.isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.9)',
                                color: msg.isUser ? 'white' : '#2d3748',
                                borderRadius: 3,
                                border: msg.isUser ? 'none' : '1px solid rgba(102, 126, 234, 0.1)',
                              }}
                            >
                              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
                                  {msg.text}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    opacity: 0.7,
                                    mt: 1,
                                    display: 'block',
                                  }}
                                >
                                  {msg.timestamp.toLocaleTimeString()}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Box>
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Chat Input */}
          <Fade in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  variant="outlined"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" sx={{ color: '#667eea' }}>
                          <Box sx={{ fontSize: '1.1rem' }}>📎</Box>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 'auto',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: '#e2e8f0',
                      color: '#a0aec0',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ fontSize: '1.2rem' }}>🚀</Box>
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </MainLayout>
    </AuthGuard>
  );
};

export default ChatPage;
